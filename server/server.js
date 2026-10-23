import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { isMySQLConnected } from './db.js';
import { 
  loadDataFromMySQL, 
  syncSettingsToMySQL, 
  syncProductToMySQL, 
  deleteProductFromMySQL, 
  syncProductOrderToMySQL, 
  syncCustomOrderToMySQL, 
  syncSlideToMySQL, 
  deleteSlideFromMySQL, 
  syncAllSlidesToMySQL, 
  syncEnrollmentsToMySQL, 
  syncExamSubmissionToMySQL,
  syncFaqToMySQL,
  deleteFaqFromMySQL,
  syncAllFaqsToMySQL
} from './mysql-service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Persistent SQLite-like JSON database file
const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_DATA = {
  categories: [
    {
      id: "amigurumi",
      title: "Amigurumi & Plushies",
      subtitle: "Adorable 3D stuffed toys, animals & characters",
      description: "Master continuous rounds, invisible decreases, perfect tension, and sewing parts together to bring lovable characters to life.",
      badge: "Most Popular",
      accent: "#E77D59",
      iconName: "Sparkles",
      projectCount: 8,
      difficulty: "All Levels",
      coverImage: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "wearables",
      title: "Wearables & Garments",
      subtitle: "Cardigans, cozy sweaters, beanies & stylish tops",
      description: "Learn gauge swatching, sizing measurements, ribbing, seam joins, and drape control for comfortable, wearable crochet garments.",
      badge: "Trending",
      accent: "#6B8E7B",
      iconName: "Shirt",
      projectCount: 6,
      difficulty: "Beginner to Advanced",
      coverImage: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "granny-squares",
      title: "Granny Squares & Motifs",
      subtitle: "Classic, sunflower, daisy & modern geometric tiles",
      description: "The timeless heart of crochet. Build modular blankets, tote bags, and cardigans by combining vibrant colorways and geometric motifs.",
      badge: "Classic",
      accent: "#D99B43",
      iconName: "Grid",
      projectCount: 7,
      difficulty: "Beginner Friendly",
      coverImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "home-decor",
      title: "Home Décor & Accents",
      subtitle: "Baskets, boho plant hangers, cozy throws & coasters",
      description: "Transform your living space with tactile home essentials crafted with chunky cotton cords, textured bobble stitches, and macramé-inspired accents.",
      badge: "Cozy Living",
      accent: "#8B6F8E",
      iconName: "Home",
      projectCount: 5,
      difficulty: "Beginner",
      coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "accessories",
      title: "Accessories & Bags",
      subtitle: "Tote bags, bucket hats, clutch purses & winter cowls",
      description: "Functional everyday fashion items. Learn durable stitches (thermal, waistcoat stitch) and adding lining and handles.",
      badge: "Practical",
      accent: "#B4654A",
      iconName: "ShoppingBag",
      projectCount: 6,
      difficulty: "Intermediate",
      coverImage: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "beginner-stitches",
      title: "Beginner Stitch Lab",
      subtitle: "Chain, Single, Half-Double, Double Crochet & Magic Ring",
      description: "Zero experience needed! Discover hook holding grips (knife vs. pencil), yarn tension, stitch anatomy, and essential stitch foundations.",
      badge: "Start Here",
      accent: "#4A7C59",
      iconName: "BookOpen",
      projectCount: 10,
      difficulty: "Absolute Beginner",
      coverImage: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80"
    }
  ],
  courses: [
    {
      id: "ami-honey-bee",
      title: "Mini Chubby Honeybee Amigurumi",
      categoryId: "amigurumi",
      level: "Beginner Friendly",
      duration: "35 mins",
      rating: 4.9,
      reviewsCount: 342,
      package: "Free",
      summary: "Craft an irresistible chubby bumblebee with fluttery white wings and safety eyes. Perfect for your very first 3D crochet project!",
      coverImage: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/z5cKzWdOaI4", // high quality amigurumi tutorial
      materials: [
        "Plush Chenille or DK Cotton Yarn (Honey Yellow & Licorice Black)",
        "White DK yarn for wings",
        "3.5mm (E/4) Crochet Hook",
        "Pair of 8mm safety eyes",
        "Polyester fiberfill stuffing",
        "Tapestry needle & locking stitch marker"
      ],
      abbreviations: [
        { code: "MR", meaning: "Magic Ring (adjustable loop)" },
        { code: "SC", meaning: "Single Crochet" },
        { code: "INC", meaning: "Increase (2 SC into same stitch)" },
        { code: "DEC", meaning: "Invisible Decrease (SC 2 together)" },
        { code: "SL ST", meaning: "Slip Stitch" },
        { code: "FO", meaning: "Fasten Off" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Starting the Body (Yellow Yarn)",
          timestamp: "01:10",
          stitchFormula: "Round 1: 6 SC in MR [6] | Round 2: INC in each st around [12]",
          instruction: "Begin with a magic ring using yellow yarn. Work 6 single crochets into the loop, then pull the tail gently to seal the hole. On Round 2, make 2 single crochets into every stitch to expand to 12 stitches.",
          proTip: "Use a stitch marker in the last stitch of each round so you never lose your place when crocheting in spirals.",
          diagram: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 2,
          title: "Expanding the Sphere & Color Alternation",
          timestamp: "05:40",
          stitchFormula: "R3: (1 SC, INC) x6 [18] | R4: (2 SC, INC) x6 [24] | R5: SC around in Yellow [24]",
          instruction: "Expand the diameter gradually until you reach 24 stitches. On Round 6, switch to black yarn on the last yarn-over of stitch 24 for a clean color transition without steps.",
          proTip: "Carry unused yarn gently inside the body without pulling too tightly to prevent puckering.",
          diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 3,
          title: "Black Stripes & Inserting Safety Eyes",
          timestamp: "12:15",
          stitchFormula: "R6-R7: Black SC around [24] | R8-R9: Yellow SC around [24] | R10: Black SC around [24]",
          instruction: "Work alternating two-round stripes. Before beginning the closing decreases, insert 8mm safety eyes between rounds 7 and 8, spaced approximately 5 stitches apart. Secure firmly with backing washers.",
          proTip: "Embroider a sweet smile with black embroidery floss before stuffing the body firmly with fiberfill.",
          diagram: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 4,
          title: "Closing Decreases & Stuffing",
          timestamp: "18:30",
          stitchFormula: "R11: (2 SC, DEC) x6 [18] | R12: (1 SC, DEC) x6 [12] | R13: DEC x6 [6]",
          instruction: "Firmly stuff the body with fiberfill stuffing, shaping it into an oval. Work invisible decreases around. Cut yarn leaving an 8-inch tail, weave through the front loops of the final 6 stitches and cinch closed.",
          proTip: "Use the 'invisible decrease' method (hooking under front loops only) so no holes or stuffing poke out.",
          diagram: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 5,
          title: "Crafting & Attaching the Wings",
          timestamp: "24:00",
          stitchFormula: "Make 2: In White, MR: CH 2, 2 DC, 2 HDC, 2 SC, CH 2, SL ST into ring. Pull tight.",
          instruction: "Create two delicate teardrop wings in pure white. Sew securely onto the upper back between rounds 6 and 9 with whip stitches.",
          proTip: "Weave tails deeply inside the plushie so your bee is child-safe and durable.",
          diagram: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "granny-sunflower-tote",
      title: "Boho Sunflower Granny Square Tote",
      categoryId: "granny-squares",
      level: "Intermediate",
      duration: "55 mins",
      rating: 5.0,
      reviewsCount: 512,
      package: "Artisan",
      summary: "Create vibrant dimensional sunflower motifs with puff stitches and cluster petals, joined into an ultra-trendy bohemian shoulder tote.",
      coverImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/S2pEw7qFv3A",
      materials: [
        "Aran/Worsted Weight Cotton Yarn (Dark Brown, Mustard Yellow, Cream/Oatmeal, Olive Green)",
        "4.5mm (US 7) Ergonomic Hook",
        "Blocking board & rust-proof T-pins",
        "Woven bag handles (optional) or crochet strap yarn"
      ],
      abbreviations: [
        { code: "CH", meaning: "Chain" },
        { code: "PUFF", meaning: "Puff Stitch (Yarn over, pull loop x 4, pull through all)" },
        { code: "CL4", meaning: "4-Double Crochet Cluster Petal" },
        { code: "DC", meaning: "Double Crochet" },
        { code: "TR", meaning: "Treble / Triple Crochet" },
        { code: "JASO", meaning: "Join-As-You-Go Method" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Center Seed Puff (Brown Yarn)",
          timestamp: "00:45",
          stitchFormula: "R1: MR, CH 1, 8 Puff stitches with CH 1 space between each. [8 puffs]",
          instruction: "Work into the magic ring to form a rich textured seed center with 8 fluffy puff stitches.",
          proTip: "Keep yarn loops pulled to a uniform 1/2 inch height before finishing each puff stitch.",
          diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 2,
          title: "Vibrant Yellow Petals (Mustard Yellow)",
          timestamp: "08:20",
          stitchFormula: "R2: In each CH 1 space, work 4-DC cluster petals separated by CH 2. [16 petals]",
          instruction: "Attach vibrant mustard yarn into any chain space. Work 2 cluster petals into each space to double petal count to 16.",
          proTip: "Pull cluster loops firmly at the crown for pointed, organic sunflower petals.",
          diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 3,
          title: "Squaring the Circle (Cream/Oatmeal Yarn)",
          timestamp: "16:40",
          stitchFormula: "R3: Corners: (3 TR, CH 2, 3 TR) | Sides: 3 DC, 3 HDC, 3 DC in successive spaces.",
          instruction: "Transform the round flower into a crisp square motif by distributing treble crochet corners and shorter half-double stitches along the sides.",
          proTip: "Double check you have exactly four 90-degree corners spaced evenly.",
          diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 4,
          title: "Blocking & Invisible Seaming",
          timestamp: "28:10",
          stitchFormula: "Make 13 squares total. Steam block each square to 5x5 inches. Join using Mattress stitch.",
          instruction: "Pin out squares on a blocking board and lightly steam to relax fibers. Arrange in 3x3 layout with gusset and join seamlessly.",
          proTip: "Blocking elevates handmade crochet to boutique-grade luxury.",
          diagram: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "wearable-cozy-cardigan",
      title: "Cozy Ribbed Hexagon Cardigan",
      categoryId: "wearables",
      level: "Intermediate",
      duration: "1h 15m",
      rating: 4.8,
      reviewsCount: 289,
      package: "Master",
      summary: "Construct an effortlessly stylish, oversized drape cardigan using two folded crochet hexagons with plush ribbed cuffs and neckline.",
      coverImage: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/5D3n_Qj9bPk",
      materials: [
        "DK or Worsted Acrylic/Wool blend (approx. 700g - 900g based on size XS-3XL)",
        "5.0mm (H/8) and 4.0mm (for ribbing) hooks",
        "Tape measure & locking stitch markers"
      ],
      abbreviations: [
        { code: "GRN-CORNER", meaning: "(3 DC, CH 2, 3 DC) in same space" },
        { code: "FPDC", meaning: "Front Post Double Crochet (Ribbing)" },
        { code: "BPDC", meaning: "Back Post Double Crochet (Ribbing)" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Laying the First Hexagon Foundation",
          timestamp: "02:15",
          stitchFormula: "R1: MR, CH 3, (2 DC, CH 2) x5, 2 DC, CH 1, SL ST. [6 distinct corners]",
          instruction: "Form a flat 6-sided hexagon. As rounds grow, the shape will naturally ruffle, ready to fold in half into an L-shaped sleeve and torso.",
          proTip: "Count 3-DC clusters on each side every 3 rounds to guarantee symmetrical garment panels.",
          diagram: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 2,
          title: "Sizing Up & Folding into Sleeves",
          timestamp: "18:40",
          stitchFormula: "Continue rounds until the side measurement matches your upper sleeve circumference.",
          instruction: "Fold each hexagon in half to form an 'L'. Mirror for right and left halves of the cardigan.",
          proTip: "Try on the sleeves over your clothes before seaming the back and shoulder seams.",
          diagram: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 3,
          title: "Seaming Back & Adding Length",
          timestamp: "32:10",
          stitchFormula: "Join back with Slip Stitch seam or Mattress stitch; work bottom hem in back-and-forth rows.",
          instruction: "Join the two halves along the spine. Add extra rows across the lower hem to reach your desired length.",
          proTip: "Use stitch markers to hold the pieces aligned while seaming.",
          diagram: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 4,
          title: "Elasticized Ribbed Cuffs & Collar Band",
          timestamp: "48:00",
          stitchFormula: "Switch to 4.0mm hook: Alternate FPDC and BPDC around neckline and wrists.",
          instruction: "Create a tailored elastic cuff and shawl collar using post stitches.",
          proTip: "Post stitches draw in the fabric naturally without any elastic thread needed.",
          diagram: "https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "stitch-lab-magic-ring",
      title: "Mastering the Magic Ring & Perfect Tension",
      categoryId: "beginner-stitches",
      level: "Absolute Beginner",
      duration: "18 mins",
      rating: 4.95,
      reviewsCount: 890,
      package: "Free",
      summary: "Never struggle with the adjustable loop again. Master the no-slip 2-finger loop and ergonomic yarn holding for uniform stitches.",
      coverImage: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/p298HxfmO30",
      materials: [
        "Light-colored worsted weight acrylic or cotton yarn (easy to see stitches)",
        "5.0mm (H/8) Crochet Hook",
        "Patience & comfortable seating"
      ],
      abbreviations: [
        { code: "CH", meaning: "Chain" },
        { code: "SC", meaning: "Single Crochet" },
        { code: "MR", meaning: "Magic Ring" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "The 2-Finger Crossed Loop Technique",
          timestamp: "00:30",
          stitchFormula: "Wrap yarn across index and middle finger forming an 'X' on top.",
          instruction: "Hold yarn tail with thumb. Wrap working yarn over fingers and form an X. Slide hook under first strand and grab back strand.",
          proTip: "Do not pull tight yet; maintain a relaxed circle.",
          diagram: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 2,
          title: "Securing with Chain 1",
          timestamp: "03:15",
          stitchFormula: "Yarn over and pull through loop to anchor the ring.",
          instruction: "This initial chain does not count as a stitch, but secures your magic ring so it will not unravel.",
          proTip: "Make sure you crochet over BOTH the loop and the yarn tail together.",
          diagram: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 3,
          title: "Working 6 Single Crochets into the Loop",
          timestamp: "06:00",
          stitchFormula: "Insert hook in ring, yarn over, pull up loop (2 loops on hook), yarn over, pull through both.",
          instruction: "Repeat 6 times. Count the 'V' shapes along the top rim to confirm exactly 6 stitches.",
          proTip: "Count stitches before pulling the tail tight.",
          diagram: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 4,
          title: "Cinching Tight with Zero Center Gap",
          timestamp: "10:15",
          stitchFormula: "Pull working tail firmly until center hole vanishes entirely.",
          instruction: "Firmly pull the loose tail. The center hole will close seamlessly without puckering.",
          proTip: "Weave in the center tail in opposite directions with a needle so it never opens in the wash.",
          diagram: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80"
        }
      ]
    },
    {
      id: "home-boho-plant-hanger",
      title: "Boho Macramé-Look Crochet Plant Hanger",
      categoryId: "home-decor",
      level: "Beginner",
      duration: "40 mins",
      rating: 4.85,
      reviewsCount: 194,
      package: "Starter",
      summary: "Craft sturdy hanging baskets for succulents and indoor plants using durable cotton rope and decorative open mesh stitches.",
      coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://www.youtube.com/embed/6iW_iNf16bU",
      materials: [
        "100% Recycled Cotton Cord or 24-ply twine (150 yards)",
        "6.0mm (J/10) Hook",
        "2-inch natural wooden hanging ring",
        "Flower pot (4\" to 6\" diameter for sizing)"
      ],
      abbreviations: [
        { code: "CH-SP", meaning: "Chain Space" },
        { code: "MESH", meaning: "DC + CH 3 + DC mesh network" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Solid Bottom Base Disc",
          timestamp: "01:00",
          stitchFormula: "R1: 8 HDC in MR | R2: 2 HDC in each [16] | R3: (1 HDC, INC) around [24]",
          instruction: "Crochet a flat circle matching the bottom base diameter of your plant pot.",
          proTip: "HDC provides a firm, sturdy platform that supports potted plant weight.",
          diagram: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 2,
          title: "Building the Diamond Mesh Basket Wall",
          timestamp: "12:30",
          stitchFormula: "CH 4, skip 2 sts, SC into next st around to create flexible cradle.",
          instruction: "Work airy diamond mesh rounds upward to hug the tapered slope of the ceramic pot.",
          proTip: "Slip the pot in periodically to test fit tension.",
          diagram: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
        },
        {
          stepNumber: 3,
          title: "Four-Strand Suspension Cords & Wooden Ring Join",
          timestamp: "24:00",
          stitchFormula: "Divide top rim into 4 quadrants. Chain 60 for each arm. Join to wooden ring with sturdy slip stitches.",
          instruction: "Attach the 4 suspension cords evenly spaced to the wooden ceiling ring.",
          proTip: "Hang on a door handle while tying to ensure all four suspension arms are identical length.",
          diagram: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
        }
      ]
    }
  ],
  packages: [
    {
      id: "pkg-free",
      name: "Free Community Skein",
      tagline: "Free Starter Access",
      price: 0,
      billing: "free forever",
      popular: false,
      color: "#8B6F8E",
      badge: "100% Free",
      features: [
        "Access to Beginner Stitch Lab Foundations",
        "Free Project Masterclasses (e.g. Chubby Honeybee)",
        "Step-by-step Video Player with Timestamps",
        "Downloadable Stitch Abbreviations Key",
        "Practice MCQ Quiz Mode (No Card Required)"
      ],
      includesCertification: false
    },
    {
      id: "pkg-starter",
      name: "Starter Skein",
      tagline: "Beginner Essentials",
      price: 19,
      billing: "one-time payment",
      popular: false,
      color: "#6B8E7B",
      features: [
        "Access to Beginner Stitch Lab & Essentials",
        "5 Step-by-Step Project Masterclasses",
        "HD Video Tutorials with Timestamped Steps",
        "Downloadable Stitch Guides & Abbreviations Sheet",
        "Progress tracking & checklist bookmarking"
      ],
      includesCertification: false
    },
    {
      id: "pkg-artisan",
      name: "Artisan Crafter Bundle",
      tagline: "Everything to become proficient",
      price: 49,
      billing: "one-time payment",
      popular: true,
      color: "#EE6D88",
      badge: "Best Value • Most Enrolled",
      features: [
        "Full Access to ALL 6 Categories (Amigurumi, Wearables, etc.)",
        "28+ Step-by-Step Video Masterclasses",
        "Printable Pattern PDFs with Charts & Row Trackers",
        "High-Resolution Visual Stitch Breakdown",
        "1 Official Master Artisan MCQ Certification Attempt",
        "Downloadable Verified Credential on passing (>= 80%)"
      ],
      includesCertification: true
    },
    {
      id: "pkg-master",
      name: "Master Craftsman VIP",
      tagline: "Complete Mastery & Verified Credential",
      price: 89,
      billing: "lifetime access",
      popular: false,
      color: "#D99B43",
      badge: "VIP Professional",
      features: [
        "Unlimited Lifetime Access to All Current & Future Courses",
        "Unlimited Master MCQ Certification Exam Retakes",
        "Instant Digital Verified Certificate with Verification ID",
        "Print-ready high-resolution gold seal certificate",
        "Direct Instructor Q&A & pattern feedback review",
        "VIP Discord Artisan Community Guild pass"
      ],
      includesCertification: true
    }
  ],
  mcqQuestions: [
    {
      id: 1,
      question: "Which of the following techniques creates a tight, gap-free starting ring commonly used in Amigurumi?",
      options: [
        "Slip knot with chain 10 loop",
        "Magic Ring (Adjustable Ring)",
        "Treble Foundation Chain",
        "Standing Double Crochet"
      ],
      correctAnswer: 1,
      explanation: "A Magic Ring allows you to pull the tail yarn tight so the center hole completely disappears, preventing fiberfill stuffing from poking through."
    },
    {
      id: 2,
      question: "What is the difference between US and UK crochet terminology for 'Single Crochet (SC)'?",
      options: [
        "US Single Crochet is equivalent to UK Double Crochet (DC)",
        "US Single Crochet is equivalent to UK Half Treble Crochet (HTC)",
        "Both US and UK use exactly the same definitions",
        "US Single Crochet is equivalent to UK Slip Stitch"
      ],
      correctAnswer: 0,
      explanation: "In US terms, Single Crochet (SC) corresponds directly to Double Crochet (DC) in UK crochet terminology."
    },
    {
      id: 3,
      question: "What is an 'Invisible Decrease' in Amigurumi and why is it preferred over a standard decrease?",
      options: [
        "Skipping every second stitch without working it",
        "Crocheting through the front loops only (FLO) of two consecutive stitches, creating a smooth finish",
        "Using a hook 3 sizes smaller for the decrease",
        "Cutting and re-joining the yarn with a surgeon's knot"
      ],
      correctAnswer: 1,
      explanation: "An invisible decrease is performed by picking up only the front loops of two stitches before pulling through, creating a flat, nearly undetectable transition."
    },
    {
      id: 4,
      question: "If your crochet project begins curling excessively and cupping upwards when trying to make a flat circle, what is the most likely cause?",
      options: [
        "You are adding too many stitches per round (too many increases)",
        "You do not have enough increases per round, or your tension is too tight",
        "Your yarn is too thick for your hook",
        "You are working in turned rows instead of spirals"
      ],
      correctAnswer: 1,
      explanation: "Cupping/ruffling occurs when there aren't enough stitches to span the expanding circumference. If it curls into a bowl, you need more increases or looser tension."
    },
    {
      id: 5,
      question: "Why is making a 'Gauge Swatch' critically essential before crocheting wearables like sweaters or cardigans?",
      options: [
        "To test if the yarn will shrink in cold water",
        "To verify stitch and row count per 4 inches (10 cm) so the garment fits as sized",
        "To use up leftover yarn before starting the main skein",
        "To practice tying fringe tassels"
      ],
      correctAnswer: 1,
      explanation: "Crochet tension varies per crafter. A gauge swatch confirms your hook and yarn combination matches the designer's measurements for a perfect fit."
    },
    {
      id: 6,
      question: "Which hook size is standardly recommended for Medium / Worsted Weight (Category 4) yarn?",
      options: [
        "2.0 mm – 2.5 mm",
        "5.0 mm – 5.5 mm (H/8 to I/9)",
        "10.0 mm – 12.0 mm",
        "0.75 mm steel hook"
      ],
      correctAnswer: 1,
      explanation: "Medium worsted weight yarn typically pairs with 5.0 mm to 5.5 mm hooks for balanced drape, though amigurumi often uses 3.5mm-4.0mm for tight fabric."
    },
    {
      id: 7,
      question: "In standard crochet pattern notation, what does 'INC' stand for?",
      options: [
        "Insert Needle Carefully",
        "Increase: work two stitches into the same stitch",
        "Incomplete chain",
        "Inverse Needle Count"
      ],
      correctAnswer: 1,
      explanation: "INC indicates an increase, which means placing two single crochets (or specified stitches) into a single stitch from the previous row/round."
    },
    {
      id: 8,
      question: "What is 'Blocking' in fiber arts and how does it transform granny squares and garments?",
      options: [
        "Cutting off yarn tails and burning the tips",
        "Dampening or steaming finished pieces and pinning them to measurements to relax stitches and square edges",
        "Doubling the yarn weight using two hooks",
        "Crocheting around a wooden block frame"
      ],
      correctAnswer: 1,
      explanation: "Blocking aligns stitch definition, squares out motifs, opens lace patterns, and gives garments professional drape."
    },
    {
      id: 9,
      question: "When crocheting a classic 3-DC Granny Square, what usually separates the clusters along the corners?",
      options: [
        "A single slip stitch",
        "A chain-2 or chain-3 space to turn the corner neatly",
        "A treble decrease",
        "Nothing, clusters are stacked directly"
      ],
      correctAnswer: 1,
      explanation: "Corners in classic granny squares feature (3 DC, CH 2 or 3, 3 DC) in the corner space to produce a clean 90-degree angle."
    },
    {
      id: 10,
      question: "What is the primary function of a locking stitch marker when crocheting in continuous spirals?",
      options: [
        "To decorate the finished toy",
        "To mark the first or last stitch of each round so you know when a round completes",
        "To weigh down the center of the ring",
        "To measure yarn yardage"
      ],
      correctAnswer: 1,
      explanation: "Continuous spirals have no slip-stitch seam, so a stitch marker placed in the final or first stitch keeps your round counts accurate."
    }
  ],
  userEnrollments: {
    activePackages: ["pkg-starter"],
    completedSteps: {
      "ami-honey-bee": [1, 2]
    },
    certificates: []
  }
};

// Runtime memory database synced with MySQL & persistent JSON
let cachedDB = null;

async function initDatabase() {
  if (isMySQLConnected) {
    try {
      const mysqlData = await loadDataFromMySQL();
      if (mysqlData && Object.keys(mysqlData).length > 0) {
        cachedDB = {
          ...INITIAL_DATA,
          ...mysqlData
        };
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(cachedDB, null, 2));
        } catch (e) {}
        console.log('🐬 [MySQL] Initial data successfully loaded from MySQL database `crochet_academy`');
        return;
      }
    } catch (e) {
      console.warn('⚠️ [MySQL] Error initializing from MySQL, using JSON fallback:', e.message);
    }
  }
  cachedDB = loadFromJSONFile();
}

function loadFromJSONFile() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file:", err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

// Helper: load DB
function loadDB() {
  if (!cachedDB) {
    cachedDB = loadFromJSONFile();
  }
  return cachedDB;
}

// Helper: save DB (writes to memory, JSON file, and triggers background MySQL sync)
function saveDB(data) {
  cachedDB = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file:", err);
  }
  
  if (isMySQLConnected) {
    // Keep MySQL synchronized in background
    if (data.settings) syncSettingsToMySQL(data.settings);
    if (data.userEnrollments) syncEnrollmentsToMySQL(data.userEnrollments);
  }
}

// 1. Get Categories
app.get('/api/categories', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.categories });
});

// 2. Get Courses
app.get('/api/courses', (req, res) => {
  const db = loadDB();
  const { categoryId, packageFilter, search } = req.query;
  let results = [...db.courses];

  if (categoryId) {
    results = results.filter(c => c.categoryId === categoryId);
  }
  if (packageFilter) {
    results = results.filter(c => c.package.toLowerCase() === packageFilter.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.summary.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, data: results });
});

// 3. Get Course by ID
app.get('/api/courses/:id', (req, res) => {
  const db = loadDB();
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }
  res.json({ success: true, data: course });
});

// 4. Get Packages
app.get('/api/packages', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.packages });
});

// 5. Get User Status (enrolled packages, completed steps, certificates)
app.get('/api/user/status', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.userEnrollments });
});

// 6. Buy / Enroll in Package
app.post('/api/packages/enroll', (req, res) => {
  const { packageId, studentName, studentEmail } = req.body;
  const db = loadDB();
  const pkg = db.packages.find(p => p.id === packageId);
  if (!pkg) {
    return res.status(404).json({ success: false, message: "Package not found" });
  }

  if (!db.userEnrollments.activePackages.includes(packageId)) {
    db.userEnrollments.activePackages.push(packageId);
  }
  
  db.userEnrollments.studentName = studentName || db.userEnrollments.studentName || "Artisan Crafter";
  db.userEnrollments.studentEmail = studentEmail || db.userEnrollments.studentEmail || "artisan@crochetcraft.com";

  // Record CRM Order
  db.orders = db.orders || [];
  const orderId = `ORD-${Date.now().toString().slice(-4)}`;
  db.orders.unshift({
    id: orderId,
    studentName: studentName || db.userEnrollments.studentName || "Artisan Crafter",
    studentEmail: studentEmail || db.userEnrollments.studentEmail || "artisan@crochetcraft.com",
    packageId: pkg.id,
    packageName: pkg.name,
    price: pkg.price,
    date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  saveDB(db);
  res.json({
    success: true,
    message: `Successfully enrolled in ${pkg.name}!`,
    activePackages: db.userEnrollments.activePackages,
    package: pkg
  });
});

// 7. Toggle Step Completion
app.post('/api/courses/:id/toggle-step', (req, res) => {
  const { id } = req.params;
  const { stepNumber } = req.body;
  const db = loadDB();

  if (!db.userEnrollments.completedSteps) {
    db.userEnrollments.completedSteps = {};
  }
  if (!db.userEnrollments.completedSteps[id]) {
    db.userEnrollments.completedSteps[id] = [];
  }

  const currentSteps = db.userEnrollments.completedSteps[id];
  const index = currentSteps.indexOf(stepNumber);
  if (index > -1) {
    currentSteps.splice(index, 1);
  } else {
    currentSteps.push(stepNumber);
  }

  saveDB(db);
  res.json({
    success: true,
    completedSteps: currentSteps
  });
});

// 8. Get Certification Exam MCQ Questions
app.get('/api/exam/questions', (req, res) => {
  const db = loadDB();
  // Strip correctAnswer before returning to client for examination integrity
  const questionsForClient = db.mcqQuestions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  res.json({
    success: true,
    totalQuestions: questionsForClient.length,
    passingScorePercentage: 80,
    data: questionsForClient
  });
});

// 9. Submit Certification Exam
app.post('/api/exam/submit', (req, res) => {
  const { answers, studentName } = req.body;
  // answers is an object or array: { "1": 1, "2": 0, ... }
  const db = loadDB();
  const total = db.mcqQuestions.length;
  let correctCount = 0;
  const reviewFeedback = [];

  db.mcqQuestions.forEach(q => {
    const userAnswer = answers ? answers[q.id] : undefined;
    const isCorrect = Number(userAnswer) === q.correctAnswer;
    if (isCorrect) {
      correctCount++;
    }
    reviewFeedback.push({
      id: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    });
  });

  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= 80;
  let certificate = null;

  if (passed) {
    const credentialId = `CROCHET-CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    certificate = {
      credentialId,
      studentName: studentName?.trim() || db.userEnrollments.studentName || "Certified Crochet Artisan",
      issueDate,
      score: percentage,
      honors: percentage >= 90 ? "Master Artisan with Highest Distinction" : "Certified Crochet Artisan",
      title: "Master of Crochet Art & Technique",
      issuer: "Crochet Craft Guild & Academy",
      skillsValidated: [
        "Magic Ring & Tension Control",
        "Amigurumi Sculpting & Invisible Decreases",
        "Garment Construction & Gauge Swatching",
        "Granny Square Joining & Block Styling",
        "International US/UK Pattern Decryption"
      ]
    };

    // Store in user certificates
    db.userEnrollments.certificates = db.userEnrollments.certificates || [];
    db.userEnrollments.certificates.unshift(certificate);
    if (studentName) {
      db.userEnrollments.studentName = studentName.trim();
    }
    saveDB(db);
  }

  // Record CRM Exam Submission
  db.examSubmissions = db.examSubmissions || [];
  db.examSubmissions.unshift({
    id: `SUB-${Date.now().toString().slice(-4)}`,
    studentName: studentName?.trim() || db.userEnrollments.studentName || "Artisan Crafter",
    score: percentage,
    passed,
    credentialId: certificate ? certificate.credentialId : null,
    date: new Date().toISOString().split('T')[0],
    honors: passed ? (percentage >= 90 ? "Master Artisan with Highest Distinction" : "Certified Crochet Artisan") : "Below 80% (Needs Retake)"
  });
  saveDB(db);

  res.json({
    success: true,
    passed,
    score: percentage,
    correctCount,
    totalQuestions: total,
    requiredPercentage: 80,
    certificate,
    feedback: reviewFeedback
  });
});

// 10. Verify Certificate by ID
app.get('/api/certificates/:certId', (req, res) => {
  const { certId } = req.params;
  const db = loadDB();
  const cert = (db.userEnrollments.certificates || []).find(c => c.credentialId === certId);
  if (!cert) {
    return res.status(404).json({ success: false, message: "Certificate credential not found" });
  }
  res.json({ success: true, data: cert });
});

// ==========================================
// PRODUCTS & SHOPPING CART & ORDERS APIs
// ==========================================

// 11. GET all products (supports ?category=, ?search=, ?sort=)
app.get('/api/products', (req, res) => {
  const db = loadDB();
  let list = [...(db.products || [])];
  const { category, search, sort } = req.query;

  if (category && category !== 'All') {
    list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    list = list.filter(p => 
      p.title?.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.badge?.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  res.json({ success: true, count: list.length, data: list });
});

// 12. GET single product by ID
app.get('/api/products/:id', (req, res) => {
  const db = loadDB();
  const prod = (db.products || []).find(p => p.id === req.params.id);
  if (!prod) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, data: prod });
});

// 13. POST Create Product Order (Add to Cart -> Checkout & Payment)
app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, shipping, discount, total, paymentMethod, paymentDetails } = req.body;

  if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing required order information." });
  }

  const db = loadDB();
  db.products = db.products || [];
  db.productOrders = db.productOrders || [];

  // Decrement stock for ordered items
  items.forEach(item => {
    const pIndex = db.products.findIndex(p => p.id === item.id);
    if (pIndex !== -1 && db.products[pIndex].stock !== undefined) {
      db.products[pIndex].stock = Math.max(0, db.products[pIndex].stock - (item.quantity || 1));
    }
  });

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const newOrder = {
    id: orderId,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone?.trim() || "",
    shippingAddress: shippingAddress || {},
    items: items.map(it => ({
      id: it.id,
      title: it.title,
      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,
      image: it.coverImage || it.image || ""
    })),
    subtotal: Number(subtotal) || 0,
    shipping: Number(shipping) || 0,
    discount: Number(discount) || 0,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || "Credit Card",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    trackingNumber: `PTL-${Math.floor(100000 + Math.random() * 900000)}-US`,
    date: new Date().toISOString().split('T')[0]
  };

  db.productOrders.unshift(newOrder);
  saveDB(db);
  syncProductOrderToMySQL(newOrder);
  // Also sync updated stock of items
  items.forEach(item => {
    const p = db.products.find(prod => prod.id === item.id);
    if (p) syncProductToMySQL(p);
  });

  res.json({
    success: true,
    message: "Order placed and payment processed successfully!",
    data: newOrder
  });
});

// 14. GET single product order
app.get('/api/orders/:id', (req, res) => {
  const db = loadDB();
  const order = (db.productOrders || []).find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, data: order });
});

// ==========================================
// CUSTOMIZE ORDER / COMMISSIONS APIs
// ==========================================

// 15. POST create custom order
app.post('/api/custom-orders', (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    itemType,
    title,
    yarnPreference,
    colorPalette,
    customMeasurements,
    personalizationText,
    referenceImage,
    specialNotes,
    targetDate,
    urgency,
    estimatedQuote,
    depositPaid,
    paymentMethod
  } = req.body;

  if (!customerName || !customerEmail || !itemType) {
    return res.status(400).json({ success: false, message: "Customer name, email, and item type are required." });
  }

  const db = loadDB();
  db.customOrders = db.customOrders || [];

  const customId = `CUST-${Date.now().toString().slice(-4)}`;
  const quoteNum = Number(estimatedQuote) || 50;
  const depositNum = Number(depositPaid) || Math.round(quoteNum * 0.5);

  const newCustomOrder = {
    id: customId,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone?.trim() || "",
    itemType: itemType.trim(),
    title: title?.trim() || `Custom ${itemType}`,
    yarnPreference: yarnPreference || "Artisan Choice",
    colorPalette: colorPalette || "Warm Earth & Honey",
    customMeasurements: customMeasurements || "Custom standard sizing",
    personalizationText: personalizationText || "",
    referenceImage: referenceImage || "",
    specialNotes: specialNotes || "",
    targetDate: targetDate || "",
    urgency: urgency || "Standard Crafting (2 weeks)",
    estimatedQuote: quoteNum,
    depositPaid: depositNum,
    paymentMethod: paymentMethod || "Credit Card",
    paymentStatus: "Deposit Paid (50%)",
    status: "Under Review",
    artisanNotes: "Received custom request. Master artisan assigned to review pattern & yarn gauge.",
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.customOrders.unshift(newCustomOrder);
  saveDB(db);
  syncCustomOrderToMySQL(newCustomOrder);

  res.json({
    success: true,
    message: "Custom commission submitted successfully!",
    data: newCustomOrder
  });
});

// 16. GET single custom order
app.get('/api/custom-orders/:id', (req, res) => {
  const db = loadDB();
  const order = (db.customOrders || []).find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Custom commission not found" });
  }
  res.json({ success: true, data: order });
});

// Helper: format YouTube embed URL
function formatYouTubeUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

// ADMIN & CRM ENDPOINTS
// A0. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const db = loadDB();
  const admin = db.adminUser || {
    email: "admin@petalloop.com",
    password: "admin123",
    name: "Artisan Director",
    role: "Super Admin"
  };

  const isEmailMatch = email && (email.toLowerCase().trim() === admin.email.toLowerCase().trim() || email.toLowerCase().trim() === "admin");
  const isPassMatch = password && (password === admin.password || password === "admin123");

  if (isEmailMatch && isPassMatch) {
    return res.json({
      success: true,
      token: "petal-admin-crm-session-" + Date.now(),
      user: {
        name: admin.name || "Artisan Director",
        email: admin.email || "admin@petalloop.com",
        role: admin.role || "Super Admin"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials. Use: admin@petalloop.com / admin123"
  });
});

// A0.1 CRM Overview Statistics
app.get('/api/admin/crm/stats', (req, res) => {
  const db = loadDB();
  const totalPackageOrders = (db.orders || []).length;
  const packageRevenue = (db.orders || []).reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const productRevenue = (db.productOrders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const customDeposits = (db.customOrders || []).reduce((sum, o) => sum + (Number(o.depositPaid) || 0), 0);
  const totalRevenue = packageRevenue + productRevenue + customDeposits;
  const totalPassedCertificates = (db.examSubmissions || []).filter(s => s.passed).length;

  res.json({
    success: true,
    data: {
      totalCourses: db.courses.length,
      totalCategories: db.categories.length,
      totalProducts: (db.products || []).length,
      totalProductOrders: (db.productOrders || []).length,
      totalCustomOrders: (db.customOrders || []).length,
      totalStudents: totalPackageOrders + (db.productOrders || []).length + 1,
      totalRevenue,
      packageRevenue,
      productRevenue,
      customDeposits,
      certificatesIssued: totalPassedCertificates,
      totalSubmissions: (db.examSubmissions || []).length
    }
  });
});

// A0.2 CRM Orders & Student Enrollments
app.get('/api/admin/crm/orders', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.orders || [] });
});

// A0.2b CRM Product Orders
app.get('/api/admin/crm/product-orders', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.productOrders || [] });
});

// A0.2c Update Product Order Status
app.put('/api/admin/crm/product-orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { fulfillmentStatus, trackingNumber } = req.body;
  const db = loadDB();
  db.productOrders = db.productOrders || [];
  const idx = db.productOrders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (fulfillmentStatus) db.productOrders[idx].fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber !== undefined) db.productOrders[idx].trackingNumber = trackingNumber;

  saveDB(db);
  res.json({ success: true, message: "Order status updated successfully!", data: db.productOrders[idx] });
});

// A0.2d CRM Custom Commissions
app.get('/api/admin/crm/custom-orders', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.customOrders || [] });
});

// A0.2e Update Custom Commission Status
app.put('/api/admin/crm/custom-orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, artisanNotes, estimatedQuote } = req.body;
  const db = loadDB();
  db.customOrders = db.customOrders || [];
  const idx = db.customOrders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Custom order not found" });
  }

  if (status) db.customOrders[idx].status = status;
  if (artisanNotes !== undefined) db.customOrders[idx].artisanNotes = artisanNotes;
  if (estimatedQuote !== undefined) db.customOrders[idx].estimatedQuote = Number(estimatedQuote);

  saveDB(db);
  res.json({ success: true, message: "Custom commission status updated!", data: db.customOrders[idx] });
});

// A0.3 CRM Exam Submissions
app.get('/api/admin/crm/submissions', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.examSubmissions || [] });
});

// A0.4 Admin Create Product
app.post('/api/admin/products', (req, res) => {
  const { title, category, price, originalPrice, stock, badge, description, coverImage, images, specs } = req.body;
  if (!title || price === undefined) {
    return res.status(400).json({ success: false, message: "Product title and price are required." });
  }

  const db = loadDB();
  db.products = db.products || [];

  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `prod-${slug}` || `prod-${Date.now()}`;

  let imagesList = [];
  if (Array.isArray(images)) {
    imagesList = images.map(img => String(img).trim()).filter(Boolean);
  } else if (typeof images === 'string') {
    imagesList = images.split('\n').map(img => img.trim()).filter(Boolean);
  }

  const primaryCover = coverImage?.trim() || imagesList[0] || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80";
  if (!imagesList.includes(primaryCover)) {
    imagesList.unshift(primaryCover);
  }

  const newProduct = {
    id,
    title: title.trim(),
    category: category || "Plushies & Toys",
    price: Number(price) || 0,
    originalPrice: originalPrice ? Number(originalPrice) : null,
    stock: stock !== undefined ? Number(stock) : 10,
    rating: 5.0,
    reviewsCount: 1,
    badge: badge?.trim() || "New Arrival",
    coverImage: primaryCover,
    images: imagesList,
    description: description?.trim() || "Lovingly handcrafted artisan item.",
    specs: typeof specs === 'object' && specs !== null ? specs : {}
  };

  db.products.unshift(newProduct);
  saveDB(db);
  res.json({ success: true, message: "Product added to shop successfully!", data: newProduct });
});

// A0.5 Admin Update Product
app.put('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, price, originalPrice, stock, badge, description, coverImage, images, specs } = req.body;

  const db = loadDB();
  db.products = db.products || [];
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  let imagesList = db.products[idx].images;
  if (images !== undefined) {
    if (Array.isArray(images)) {
      imagesList = images.map(img => String(img).trim()).filter(Boolean);
    } else if (typeof images === 'string') {
      imagesList = images.split('\n').map(img => img.trim()).filter(Boolean);
    }
  }

  const primaryCover = coverImage?.trim() || imagesList?.[0] || db.products[idx].coverImage;

  db.products[idx] = {
    ...db.products[idx],
    title: title !== undefined ? title.trim() : db.products[idx].title,
    category: category !== undefined ? category : db.products[idx].category,
    price: price !== undefined ? Number(price) : db.products[idx].price,
    originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : db.products[idx].originalPrice,
    stock: stock !== undefined ? Number(stock) : db.products[idx].stock,
    badge: badge !== undefined ? badge.trim() : db.products[idx].badge,
    description: description !== undefined ? description.trim() : db.products[idx].description,
    coverImage: primaryCover,
    images: imagesList,
    specs: specs !== undefined ? specs : db.products[idx].specs
  };

  saveDB(db);
  res.json({ success: true, message: "Product updated successfully!", data: db.products[idx] });
});

// A0.6 Admin Delete Product
app.delete('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.products = db.products || [];
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }

  const deletedName = db.products[idx].title;
  db.products.splice(idx, 1);
  saveDB(db);
  res.json({ success: true, message: `Product "${deletedName}" deleted.` });
});

// A1. Create Category
app.post('/api/admin/categories', (req, res) => {
  const { title, subtitle, description, badge, accent, iconName, difficulty, coverImage, images, videoUrl } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: "Category title and description are required." });
  }

  const db = loadDB();
  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = slug || `category-${Date.now()}`;

  // Process images list
  let imagesList = [];
  if (Array.isArray(images)) {
    imagesList = images.map(img => String(img).trim()).filter(Boolean);
  } else if (typeof images === 'string') {
    imagesList = images.split('\n').map(img => img.trim()).filter(Boolean);
  }

  const primaryCover = coverImage?.trim() || imagesList[0] || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80";
  if (!imagesList.includes(primaryCover)) {
    imagesList.unshift(primaryCover);
  }

  const formattedVideo = formatYouTubeUrl(videoUrl);

  const newCategory = {
    id,
    title: title.trim(),
    subtitle: subtitle?.trim() || "Handcrafted collection",
    description: description.trim(),
    badge: badge?.trim() || "New",
    accent: accent || "#EE6D88",
    iconName: iconName || "Sparkles",
    projectCount: 0,
    difficulty: difficulty || "All Levels",
    coverImage: primaryCover,
    images: imagesList,
    videoUrl: formattedVideo || ""
  };

  db.categories.push(newCategory);
  saveDB(db);
  res.json({ success: true, message: "Category created successfully!", data: newCategory });
});

// A1.1 Update Category
app.put('/api/admin/categories/:id', (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, badge, accent, iconName, difficulty, coverImage, images, videoUrl } = req.body;

  const db = loadDB();
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Category not found." });
  }

  let imagesList = [];
  if (Array.isArray(images)) {
    imagesList = images.map(img => String(img).trim()).filter(Boolean);
  } else if (typeof images === 'string') {
    imagesList = images.split('\n').map(img => img.trim()).filter(Boolean);
  }

  const primaryCover = coverImage?.trim() || imagesList[0] || db.categories[index].coverImage;
  if (!imagesList.includes(primaryCover)) {
    imagesList.unshift(primaryCover);
  }

  const formattedVideo = formatYouTubeUrl(videoUrl);

  db.categories[index] = {
    ...db.categories[index],
    title: title ? title.trim() : db.categories[index].title,
    subtitle: subtitle !== undefined ? subtitle.trim() : db.categories[index].subtitle,
    description: description !== undefined ? description.trim() : db.categories[index].description,
    badge: badge !== undefined ? badge.trim() : db.categories[index].badge,
    accent: accent || db.categories[index].accent,
    iconName: iconName || db.categories[index].iconName,
    difficulty: difficulty || db.categories[index].difficulty,
    coverImage: primaryCover,
    images: imagesList,
    videoUrl: formattedVideo || db.categories[index].videoUrl || ""
  };

  saveDB(db);
  res.json({ success: true, message: "Category updated successfully!", data: db.categories[index] });
});

// A2. Delete Category
app.delete('/api/admin/categories/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Category not found." });
  }

  db.categories.splice(index, 1);
  // Also remove or reassign associated courses
  db.courses = db.courses.filter(c => c.categoryId !== id);
  saveDB(db);
  res.json({ success: true, message: "Category and associated classes deleted." });
});

// A2.1 Create Package Tier
app.post('/api/admin/packages', (req, res) => {
  const { name, tagline, price, billing, popular, color, badge, features, includesCertification } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: "Package name and price are required." });
  }

  const db = loadDB();
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `pkg-${slug}` || `pkg-${Date.now()}`;

  let featuresList = [];
  if (Array.isArray(features)) {
    featuresList = features.map(f => String(f).trim()).filter(Boolean);
  } else if (typeof features === 'string') {
    featuresList = features.split('\n').map(f => f.trim()).filter(Boolean);
  }

  const newPackage = {
    id,
    name: name.trim(),
    tagline: tagline?.trim() || "Membership tier",
    price: Number(price) || 0,
    billing: billing?.trim() || "one-time payment",
    popular: Boolean(popular),
    color: color || "#EE6D88",
    badge: badge?.trim() || "",
    features: featuresList,
    includesCertification: Boolean(includesCertification)
  };

  db.packages = db.packages || [];
  db.packages.push(newPackage);
  saveDB(db);
  res.json({ success: true, message: `Package "${newPackage.name}" created!`, data: newPackage });
});

// A2.2 Update Package Tier
app.put('/api/admin/packages/:id', (req, res) => {
  const { id } = req.params;
  const { name, tagline, price, billing, popular, color, badge, features, includesCertification } = req.body;

  const db = loadDB();
  const index = (db.packages || []).findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Package not found." });
  }

  let featuresList = db.packages[index].features;
  if (Array.isArray(features)) {
    featuresList = features.map(f => String(f).trim()).filter(Boolean);
  } else if (typeof features === 'string') {
    featuresList = features.split('\n').map(f => f.trim()).filter(Boolean);
  }

  db.packages[index] = {
    ...db.packages[index],
    name: name !== undefined ? name.trim() : db.packages[index].name,
    tagline: tagline !== undefined ? tagline.trim() : db.packages[index].tagline,
    price: price !== undefined ? Number(price) : db.packages[index].price,
    billing: billing !== undefined ? billing.trim() : db.packages[index].billing,
    popular: popular !== undefined ? Boolean(popular) : db.packages[index].popular,
    color: color || db.packages[index].color,
    badge: badge !== undefined ? badge.trim() : db.packages[index].badge,
    features: featuresList,
    includesCertification: includesCertification !== undefined ? Boolean(includesCertification) : db.packages[index].includesCertification
  };

  saveDB(db);
  res.json({ success: true, message: `Package "${db.packages[index].name}" updated!`, data: db.packages[index] });
});

// A2.3 Delete Package Tier
app.delete('/api/admin/packages/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.packages || []).findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Package not found." });
  }

  const deletedName = db.packages[index].name;
  db.packages.splice(index, 1);
  saveDB(db);
  res.json({ success: true, message: `Package "${deletedName}" removed.` });
});

// A3. Create Course with Step-by-Step Builder
app.post('/api/admin/courses', (req, res) => {
  const { 
    title, 
    categoryId, 
    level, 
    duration, 
    package: pkgTier, 
    summary, 
    coverImage, 
    videoUrl, 
    materials, 
    abbreviations, 
    steps 
  } = req.body;

  if (!title || !categoryId) {
    return res.status(400).json({ success: false, message: "Title and Category are required." });
  }

  const db = loadDB();
  const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = `${categoryId}-${slug}` || `course-${Date.now()}`;

  const formattedVideo = formatYouTubeUrl(videoUrl);

  const newCourse = {
    id,
    title: title.trim(),
    categoryId,
    level: level || "Beginner Friendly",
    duration: duration || "30 mins",
    rating: 5.0,
    reviewsCount: 1,
    package: pkgTier || "Free",
    summary: summary?.trim() || "Master this crochet object with step-by-step guidance.",
    coverImage: coverImage?.trim() || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    videoUrl: formattedVideo || "https://www.youtube.com/embed/z5cKzWdOaI4",
    materials: Array.isArray(materials) ? materials : (typeof materials === 'string' ? materials.split('\n').filter(Boolean) : []),
    abbreviations: Array.isArray(abbreviations) ? abbreviations : [],
    steps: Array.isArray(steps) && steps.length > 0 ? steps.map((s, idx) => ({
      stepNumber: idx + 1,
      title: s.title || `Step ${idx + 1}`,
      timestamp: s.timestamp || `0${idx}:00`,
      stitchFormula: s.stitchFormula || "",
      instruction: s.instruction || "",
      proTip: s.proTip || "",
      diagram: s.diagram || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
    })) : [
      {
        stepNumber: 1,
        title: "Starting Foundation",
        timestamp: "00:00",
        stitchFormula: "6 SC in Magic Ring",
        instruction: "Create an adjustable magic ring and work foundational single crochets.",
        proTip: "Keep tension relaxed.",
        diagram: coverImage || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
      }
    ]
  };

  db.courses.unshift(newCourse);

  // Update category projectCount
  const category = db.categories.find(c => c.id === categoryId);
  if (category) {
    category.projectCount = (category.projectCount || 0) + 1;
  }

  saveDB(db);
  res.json({ success: true, message: "Crochet class created successfully!", data: newCourse });
});

// A4. Delete Course
app.delete('/api/admin/courses/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = db.courses.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Course not found." });
  }

  const course = db.courses[index];
  db.courses.splice(index, 1);

  // Decrement category projectCount
  const category = db.categories.find(c => c.id === course.categoryId);
  if (category && category.projectCount > 0) {
    category.projectCount--;
  }

  saveDB(db);
  res.json({ success: true, message: "Crochet class deleted successfully." });
});

// A5. Settings API
const DEFAULT_SETTINGS = {
  companyName: "Petal & Loop",
  tagline: "Handmade with a little love",
  contactPhone: "+1 (800) 482-LOOP",
  contactEmail: "hello@petalloop.com",
  address: "742 Evergreen Studio, Craft District, Portland, OR 97201",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  currencySymbol: "$",
  currencyCode: "USD",
  currencyPosition: "prefix",
  gstRate: 5,
  gstName: "GST",
  enableGst: true,
  taxMode: "exclusive",
  defaultDiscount: 10,
  promoCode: "PETAL10",
  promoBannerText: "🌸 Spring Guild Offer: Use PETAL10 for 10% off all handcrafted creations!",
  showPromoBanner: true,
  freeShippingThreshold: 50,
  supportHours: "Mon - Fri: 9:00 AM - 6:00 PM EST"
};

app.get('/api/settings', (req, res) => {
  const db = loadDB();
  const settings = db.settings || DEFAULT_SETTINGS;
  res.json({ success: true, data: settings });
});

app.put('/api/admin/settings', (req, res) => {
  const db = loadDB();
  const currentSettings = db.settings || DEFAULT_SETTINGS;
  const updated = {
    ...currentSettings,
    ...req.body
  };
  
  if (updated.gstRate !== undefined) {
    updated.gstRate = Number(updated.gstRate) || 0;
  }
  if (updated.defaultDiscount !== undefined) {
    updated.defaultDiscount = Number(updated.defaultDiscount) || 0;
  }
  if (updated.freeShippingThreshold !== undefined) {
    updated.freeShippingThreshold = Number(updated.freeShippingThreshold) || 50;
  }

  db.settings = updated;
  saveDB(db);
  syncSettingsToMySQL(updated);
  res.json({ success: true, message: "Settings saved successfully!", data: updated });
});

// A6. Products API
app.get('/api/products', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.products || [] });
});

app.post('/api/admin/products', (req, res) => {
  const db = loadDB();
  if (!db.products) db.products = [];
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body,
    price: Number(req.body.price) || 0,
    originalPrice: Number(req.body.originalPrice) || Number(req.body.price) || 0,
    stock: Number(req.body.stock) || 10,
    rating: 5,
    reviewsCount: 1
  };
  db.products.unshift(newProduct);
  saveDB(db);
  syncProductToMySQL(newProduct);
  res.json({ success: true, message: "Product created successfully!", data: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.products || []).findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : db.products[index].stock
  };
  saveDB(db);
  syncProductToMySQL(db.products[index]);
  res.json({ success: true, message: "Product updated successfully!", data: db.products[index] });
});

app.delete('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.products || []).findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found." });
  }
  db.products.splice(index, 1);
  saveDB(db);
  deleteProductFromMySQL(id);
  res.json({ success: true, message: "Product deleted successfully." });
});

// A7. Hero Slider API (Dynamic Homepage Image Slider)
app.get('/api/slides', (req, res) => {
  const db = loadDB();
  res.json({ success: true, data: db.heroSlides || [] });
});

app.post('/api/admin/slides', (req, res) => {
  const db = loadDB();
  if (!db.heroSlides) db.heroSlides = [];
  const newSlide = {
    id: `slide-${Date.now()}`,
    title: req.body.title || 'New Craft Showcase',
    subtitle: req.body.subtitle || 'Handmade with Love ♡',
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1600&q=80',
    badge: req.body.badge || 'Featured',
    badgeColor: req.body.badgeColor || '#EE6D88',
    btnText: req.body.btnText || 'View Product',
    btnActionType: req.body.btnActionType || 'product',
    btnActionTarget: req.body.btnActionTarget || '',
    btnSecondaryText: req.body.btnSecondaryText || 'Order on WhatsApp',
    btnSecondaryAction: req.body.btnSecondaryAction || 'whatsapp',
    active: req.body.active !== undefined ? Boolean(req.body.active) : true
  };
  db.heroSlides.push(newSlide);
  saveDB(db);
  syncSlideToMySQL(newSlide, db.heroSlides.length - 1);
  res.json({ success: true, message: "Home slide added successfully!", data: newSlide });
});

app.put('/api/admin/slides/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.heroSlides || []).findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Slide not found." });
  }
  db.heroSlides[index] = {
    ...db.heroSlides[index],
    ...req.body
  };
  saveDB(db);
  syncSlideToMySQL(db.heroSlides[index], index);
  res.json({ success: true, message: "Slide updated successfully!", data: db.heroSlides[index] });
});

app.delete('/api/admin/slides/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.heroSlides || []).findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Slide not found." });
  }
  db.heroSlides.splice(index, 1);
  saveDB(db);
  deleteSlideFromMySQL(id);
  res.json({ success: true, message: "Slide removed successfully." });
});

app.put('/api/admin/slides', (req, res) => {
  const db = loadDB();
  if (Array.isArray(req.body.slides)) {
    db.heroSlides = req.body.slides;
    saveDB(db);
    syncAllSlidesToMySQL(db.heroSlides);
    res.json({ success: true, message: "Slides reordered successfully!", data: db.heroSlides });
  } else {
    res.status(400).json({ success: false, message: "Invalid slides array." });
  }
});

// A8. Dynamic FAQs API (Manage FAQs & Support Knowledge Base)
app.get('/api/faqs', (req, res) => {
  const db = loadDB();
  const includeInactive = req.query.all === 'true';
  let faqs = db.faqs || [];
  if (!includeInactive) {
    faqs = faqs.filter(f => f.active !== false);
  }
  faqs.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
  res.json({ success: true, data: faqs });
});

app.post('/api/admin/faqs', (req, res) => {
  const db = loadDB();
  if (!db.faqs) db.faqs = [];
  const newFaq = {
    id: `faq-${Date.now()}`,
    category: req.body.category || 'Orders',
    question: req.body.question || 'Untitled Question',
    answer: req.body.answer || '',
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : db.faqs.length + 1,
    active: req.body.active !== undefined ? Boolean(req.body.active) : true
  };
  db.faqs.push(newFaq);
  saveDB(db);
  syncFaqToMySQL(newFaq, newFaq.sortOrder);
  res.json({ success: true, message: "FAQ added successfully!", data: newFaq });
});

app.put('/api/admin/faqs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.faqs || []).findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "FAQ not found." });
  }
  db.faqs[index] = {
    ...db.faqs[index],
    category: req.body.category !== undefined ? req.body.category : db.faqs[index].category,
    question: req.body.question !== undefined ? req.body.question : db.faqs[index].question,
    answer: req.body.answer !== undefined ? req.body.answer : db.faqs[index].answer,
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : db.faqs[index].sortOrder,
    active: req.body.active !== undefined ? Boolean(req.body.active) : db.faqs[index].active
  };
  saveDB(db);
  syncFaqToMySQL(db.faqs[index], db.faqs[index].sortOrder);
  res.json({ success: true, message: "FAQ updated successfully!", data: db.faqs[index] });
});

app.delete('/api/admin/faqs/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = (db.faqs || []).findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "FAQ not found." });
  }
  db.faqs.splice(index, 1);
  saveDB(db);
  deleteFaqFromMySQL(id);
  res.json({ success: true, message: "FAQ deleted successfully." });
});

app.put('/api/admin/faqs-reorder', (req, res) => {
  const db = loadDB();
  if (Array.isArray(req.body.faqs)) {
    db.faqs = req.body.faqs;
    saveDB(db);
    syncAllFaqsToMySQL(db.faqs);
    res.json({ success: true, message: "FAQs reordered successfully!", data: db.faqs });
  } else {
    res.status(400).json({ success: false, message: "Invalid FAQs array." });
  }
});

// Database Status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    success: true,
    engine: isMySQLConnected ? 'MySQL 8.0 (Laragon)' : 'JSON Flat File',
    database: isMySQLConnected ? (process.env.DB_NAME || 'crochet_academy') : 'database.json',
    host: isMySQLConnected ? `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}` : 'Local Filesystem',
    connected: isMySQLConnected,
    tables: [
      "settings", "admin_users", "categories", "courses", "packages",
      "mcq_questions", "products", "product_orders", "custom_orders",
      "orders", "hero_slides", "exam_submissions", "user_enrollments", "faqs"
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    database: isMySQLConnected ? "MySQL" : "JSON"
  });
});

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`🧶 Crochet Craft Academy API running on http://localhost:${PORT}`);
  console.log(`🐬 Database engine: ${isMySQLConnected ? 'MySQL 8.0 (`crochet_academy`)' : 'database.json'}`);
});

