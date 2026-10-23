import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, DollarSign, BookOpen, Layers, Award, 
  Plus, Trash2, Video, Search, CheckCircle2, AlertCircle, 
  LogOut, ArrowLeft, Lock, ShieldCheck, Film, ListOrdered, 
  ExternalLink, Sparkles, FolderPlus, Eye, Image as ImageIcon,
  Edit3, Bold, Italic, Underline, List, Heading, 
  Quote, Code, Play, X, Check, RefreshCw, LayoutGrid, LayoutList,
  Package, ShoppingBag, Truck, Tag, SlidersHorizontal, Settings,
  Phone, Mail, MapPin, Percent, Coins, Globe, HelpCircle
} from 'lucide-react';

export default function AdminCRM({ 
  categories, 
  courses, 
  packages: initialPackages = [], 
  products: initialProducts = [],
  slides: initialSlides = [],
  onUpdateSlides = null,
  faqs: initialFaqs = [],
  onUpdateFaqs = null,
  onClose, 
  onRefreshData,
  settings: initialSettings = null,
  onUpdateSettings = null
}) {
  // Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('petal_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginEmail, setLoginEmail] = useState('admin@petalloop.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // CRM Active Tab: 'dashboard' | 'courses' | 'categories' | 'orders' | 'certifications'
  const [crmTab, setCrmTab] = useState('dashboard');

  // CRM Data State
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalCategories: 0,
    totalStudents: 0,
    totalRevenue: 0,
    certificatesIssued: 0,
    totalSubmissions: 0
  });
  const [orders, setOrders] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [crmLoading, setCrmLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [subSearch, setSubSearch] = useState('');

  // Products & Orders States
  const [productsList, setProductsList] = useState([]);
  const [productOrdersList, setProductOrdersList] = useState([]);
  const [customOrdersList, setCustomOrdersList] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [prodOrderSearch, setProdOrderSearch] = useState('');
  const [customOrderSearch, setCustomOrderSearch] = useState('');

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const initialProductForm = {
    title: '',
    category: 'Plushies & Toys',
    price: '',
    originalPrice: '',
    stock: 10,
    badge: 'Best Seller',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    imagesText: '',
    material: '100% Organic Cotton',
    dimensions: '6 x 4 inches',
    care: 'Spot clean with gentle soap'
  };
  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingCustomOrder, setEditingCustomOrder] = useState(null);

  // Home Hero Slider State
  const [slidesList, setSlidesList] = useState(initialSlides || []);
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);

  const initialSlideForm = {
    title: '',
    subtitle: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1600&q=80',
    badge: '🌸 Bestseller',
    badgeColor: '#EE6D88',
    btnText: 'View Product',
    btnActionType: 'product',
    btnActionTarget: '',
    btnSecondaryText: 'Chat on WhatsApp',
    btnSecondaryAction: 'whatsapp',
    active: true
  };
  const [slideForm, setSlideForm] = useState(initialSlideForm);
  const [dbInfo, setDbInfo] = useState(null);

  // FAQ Management State
  const [faqsList, setFaqsList] = useState(initialFaqs || []);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState('All');
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const initialFaqForm = {
    category: 'Orders',
    question: '',
    answer: '',
    active: true,
    sortOrder: 0
  };
  const [faqForm, setFaqForm] = useState(initialFaqForm);

  // Settings State (Company Name, Logo, Favicon, Contact Info, Currency, GST, Discounts)
  const defaultSettingsState = {
    companyName: 'Tishaya Petal & Loop',
    tagline: 'Handmade • Unique • With Love ♡',
    contactPhone: '+91 9099962395',
    whatsappNumber: '919099962395',
    contactEmail: 'anjalicrochetknit@gmail.com',
    address: '2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyPosition: 'prefix',
    gstRate: 5,
    gstName: 'GST (India)',
    enableGst: true,
    taxMode: 'exclusive',
    defaultDiscount: 10,
    promoCode: 'ANJALI10',
    promoBannerText: '🌸 Tishaya Petal & Loop ♡ Bouquets from ₹499 & Keychains from ₹40 · WhatsApp: +91 9099962395 · Pan-India Delivery!',
    showPromoBanner: true,
    freeShippingThreshold: 499,
    supportHours: 'Open Every Day: 10:00 AM – 9:00 PM IST'
  };
  const [settingsForm, setSettingsForm] = useState(initialSettings || defaultSettingsState);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Course Form State
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    categoryId: categories[0]?.id || 'amigurumi',
    level: 'Beginner Friendly',
    duration: '35 mins',
    package: 'Free',
    summary: '',
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=z5cKzWdOaI4',
    materialsText: "Worsted Weight Cotton Yarn (Color A & B)\n4.0mm Crochet Hook\nYarn needle & stitch markers\nFiberfill stuffing",
    steps: [
      {
        stepNumber: 1,
        title: "Magic Ring & First Round",
        timestamp: "00:45",
        stitchFormula: "Round 1: 6 SC in MR [6]",
        instruction: "Make an adjustable magic ring and crochet 6 single crochets into the loop. Cinch tight.",
        proTip: "Keep your tension uniform for easy insertion on Round 2.",
        diagram: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
      },
      {
        stepNumber: 2,
        title: "Increases & Shaping",
        timestamp: "04:10",
        stitchFormula: "Round 2: INC in each st around [12]",
        instruction: "Work 2 single crochets into each stitch of the previous round to double your stitch count.",
        proTip: "Place a locking stitch marker in the last stitch of each round.",
        diagram: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
      }
    ]
  });

  // Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryViewMode, setCategoryViewMode] = useState('table'); // 'table' | 'grid'
  const [selectedPreviewCat, setSelectedPreviewCat] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [richEditorTab, setRichEditorTab] = useState('editor'); // 'editor' | 'preview'
  const descTextareaRef = useRef(null);

  const initialCatForm = {
    title: '',
    subtitle: '',
    description: '<p>Master <strong>essential crochet skills</strong> with high-definition video tutorials and illustrated stitch charts.</p><ul><li>Zero-gap tension control</li><li>Step-by-step foundation technique</li><li>Boutique artisan finishing</li></ul>',
    badge: 'New',
    accent: '#EE6D88',
    iconName: 'Sparkles',
    difficulty: 'All Levels',
    coverImage: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=z5cKzWdOaI4'
  };

  const [catForm, setCatForm] = useState(initialCatForm);

  // Packages State
  const [packagesList, setPackagesList] = useState(initialPackages || []);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageViewMode, setPackageViewMode] = useState('cards'); // 'cards' | 'table'

  const initialPkgForm = {
    name: '',
    tagline: 'Complete craft curriculum & support',
    price: 39,
    billing: 'one-time payment',
    popular: false,
    color: '#EE6D88',
    badge: 'Artisan Pick',
    featuresText: "Unlimited access to all video masterclasses\nDetailed PDF pattern downloads & stitch counts\nStep-by-step progress tracking\nOfficial 80% MCQ certification attempt with verified credential",
    includesCertification: true
  };

  const [pkgForm, setPkgForm] = useState(initialPkgForm);

  // Load CRM Data when logged in
  useEffect(() => {
    if (adminUser) {
      fetchCRMData();
    }
  }, [adminUser]);

  const fetchCRMData = async () => {
    setCrmLoading(true);
    try {
      const [statsRes, ordersRes, subsRes, pkgRes, prodRes, prodOrdersRes, custOrdersRes, settingsRes, slidesRes, faqsRes, dbStatusRes] = await Promise.all([
        fetch('/api/admin/crm/stats'),
        fetch('/api/admin/crm/orders'),
        fetch('/api/admin/crm/submissions'),
        fetch('/api/packages'),
        fetch('/api/products'),
        fetch('/api/admin/crm/product-orders'),
        fetch('/api/admin/crm/custom-orders'),
        fetch('/api/settings'),
        fetch('/api/slides'),
        fetch('/api/faqs?all=true'),
        fetch('/api/db-status')
      ]);

      const [statsData, ordersData, subsData, pkgData, prodData, prodOrdersData, custOrdersData, settingsData, slidesData, faqsData, dbStatusData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        subsRes.json(),
        pkgRes.json(),
        prodRes.json(),
        prodOrdersRes.json(),
        custOrdersRes.json(),
        settingsRes.json(),
        slidesRes.json(),
        faqsRes.json(),
        dbStatusRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (subsData.success) setSubmissions(subsData.data);
      if (pkgData.success) setPackagesList(pkgData.data);
      if (prodData.success) setProductsList(prodData.data);
      if (prodOrdersData.success) setProductOrdersList(prodOrdersData.data);
      if (custOrdersData.success) setCustomOrdersList(custOrdersData.data);
      if (settingsData.success && settingsData.data) setSettingsForm(settingsData.data);
      if (slidesData.success && slidesData.data) setSlidesList(slidesData.data);
      if (faqsData.success && faqsData.data) {
        setFaqsList(faqsData.data);
        if (onUpdateFaqs) onUpdateFaqs(faqsData.data);
      }
      if (dbStatusData.success) setDbInfo(dbStatusData);
    } catch (err) {
      console.error("Error fetching CRM records:", err);
    } finally {
      setCrmLoading(false);
    }
  };

  // Slide CRUD Handlers
  const handleSaveSlide = async (e) => {
    e.preventDefault();
    try {
      const url = editingSlideId ? `/api/admin/slides/${editingSlideId}` : '/api/admin/slides';
      const method = editingSlideId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: editingSlideId ? `Slide "${slideForm.title}" updated successfully!` : `Slide "${slideForm.title}" added to Homepage Slider!` 
        });
        setIsAddingSlide(false);
        setEditingSlideId(null);
        setSlideForm(initialSlideForm);
        // Refresh slides list
        const refreshed = await (await fetch('/api/slides')).json();
        if (refreshed.success) {
          setSlidesList(refreshed.data);
          if (onUpdateSlides) onUpdateSlides(refreshed.data);
        }
      } else {
        alert(data.message || "Failed to save slide.");
      }
    } catch (err) {
      alert("Error saving slide: " + err.message);
    }
  };

  const handleEditSlide = (slide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image || '',
      badge: slide.badge || '🌸 Bestseller',
      badgeColor: slide.badgeColor || '#C86D51',
      btnText: slide.btnText || 'View Product',
      btnActionType: slide.btnActionType || 'product',
      btnActionTarget: slide.btnActionTarget || '',
      btnSecondaryText: slide.btnSecondaryText || 'Chat on WhatsApp',
      btnSecondaryAction: slide.btnSecondaryAction || 'whatsapp',
      active: slide.active !== false
    });
    setIsAddingSlide(true);
  };

  const handleDeleteSlide = async (slideId, title) => {
    if (!window.confirm(`Delete homepage slide "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/slides/${slideId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Slide "${title}" removed from slider.` });
        const refreshed = await (await fetch('/api/slides')).json();
        if (refreshed.success) {
          setSlidesList(refreshed.data);
          if (onUpdateSlides) onUpdateSlides(refreshed.data);
        }
      }
    } catch (err) {
      alert("Error deleting slide: " + err.message);
    }
  };

  const handleToggleSlideActive = async (slide) => {
    try {
      const updatedSlide = { ...slide, active: !slide.active };
      const res = await fetch(`/api/admin/slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSlide)
      });
      const data = await res.json();
      if (data.success) {
        const updatedList = slidesList.map(s => s.id === slide.id ? updatedSlide : s);
        setSlidesList(updatedList);
        if (onUpdateSlides) onUpdateSlides(updatedList);
      }
    } catch (err) {
      console.error("Error toggling slide status", err);
    }
  };

  // FAQ CRUD Handlers
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setIsSavingFaq(true);
    try {
      const url = editingFaqId ? `/api/admin/faqs/${editingFaqId}` : '/api/admin/faqs';
      const method = editingFaqId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: editingFaqId ? `FAQ question updated successfully!` : `New FAQ added successfully!` 
        });
        setIsAddingFaq(false);
        setEditingFaqId(null);
        setFaqForm(initialFaqForm);
        // Refresh FAQ list
        const refreshed = await (await fetch('/api/faqs?all=true')).json();
        if (refreshed.success && refreshed.data) {
          setFaqsList(refreshed.data);
          if (onUpdateFaqs) onUpdateFaqs(refreshed.data);
        }
      } else {
        alert(data.message || "Failed to save FAQ.");
      }
    } catch (err) {
      alert("Error saving FAQ: " + err.message);
    } finally {
      setIsSavingFaq(false);
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setFaqForm({
      category: faq.category || 'Orders',
      question: faq.question || '',
      answer: faq.answer || '',
      active: faq.active !== false,
      sortOrder: faq.sortOrder || 0
    });
    setIsAddingFaq(true);
  };

  const handleDeleteFaq = async (faqId, question) => {
    if (!window.confirm(`Delete FAQ "${question.substring(0, 45)}..."?`)) return;
    try {
      const res = await fetch(`/api/admin/faqs/${faqId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `FAQ deleted successfully.` });
        const refreshed = await (await fetch('/api/faqs?all=true')).json();
        if (refreshed.success && refreshed.data) {
          setFaqsList(refreshed.data);
          if (onUpdateFaqs) onUpdateFaqs(refreshed.data);
        }
      } else {
        alert(data.message || "Failed to delete FAQ.");
      }
    } catch (err) {
      alert("Error deleting FAQ: " + err.message);
    }
  };

  const handleToggleFaqActive = async (faq) => {
    try {
      const updatedFaq = { ...faq, active: !faq.active };
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFaq)
      });
      const data = await res.json();
      if (data.success) {
        const updatedList = faqsList.map(f => f.id === faq.id ? updatedFaq : f);
        setFaqsList(updatedList);
        if (onUpdateFaqs) onUpdateFaqs(updatedList);
      }
    } catch (err) {
      console.error("Error toggling FAQ status", err);
    }
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setAdminUser(data.user);
        localStorage.setItem('petal_admin_user', JSON.stringify(data.user));
      } else {
        setLoginError(data.message || 'Invalid login credentials.');
      }
    } catch (err) {
      setLoginError('Server connection error. Please verify backend is running.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('petal_admin_user');
  };

  // Add Step
  const handleAddStep = () => {
    setCourseForm(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          stepNumber: prev.steps.length + 1,
          title: `Step ${prev.steps.length + 1}`,
          timestamp: `0${prev.steps.length + 2}:00`,
          stitchFormula: "",
          instruction: "",
          proTip: "",
          diagram: prev.coverImage || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
        }
      ]
    }));
  };

  const handleRemoveStep = (index) => {
    if (courseForm.steps.length <= 1) {
      alert("At least one step is required.");
      return;
    }
    setCourseForm(prev => {
      const updated = prev.steps.filter((_, i) => i !== index).map((s, idx) => ({
        ...s,
        stepNumber: idx + 1
      }));
      return { ...prev, steps: updated };
    });
  };

  const handleUpdateStep = (index, field, value) => {
    setCourseForm(prev => {
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, steps: updated };
    });
  };

  // Submit Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const materialsList = courseForm.materialsText
        .split('\n')
        .map(m => m.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseForm, materials: materialsList })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Class "${courseForm.title}" published with ${courseForm.steps.length} steps!` });
        setIsAddingCourse(false);
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      } else {
        alert(data.message || "Failed to add class.");
      }
    } catch {
      alert("Network error creating course.");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Delete crochet class "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Class "${title}" removed.` });
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      }
    } catch {
      alert("Error deleting class.");
    }
  };

  // YouTube Embed Formatter
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    return url;
  };

  // Multiple Images Handlers
  const handleAddImage = (urlToAdd) => {
    const url = (urlToAdd || newImageUrl).trim();
    if (!url) return;
    if (catForm.images.includes(url)) {
      alert("This photo is already in the category gallery.");
      return;
    }
    setCatForm(prev => ({
      ...prev,
      images: [...prev.images, url],
      coverImage: prev.coverImage || url
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    if (catForm.images.length <= 1) {
      alert("Category requires at least one image.");
      return;
    }
    setCatForm(prev => {
      const removedUrl = prev.images[indexToRemove];
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      const newCover = prev.coverImage === removedUrl ? filtered[0] : prev.coverImage;
      return {
        ...prev,
        images: filtered,
        coverImage: newCover
      };
    });
  };

  const handleSetPrimaryCover = (imageUrl) => {
    setCatForm(prev => ({ ...prev, coverImage: imageUrl }));
  };

  // Rich Text Editor Toolbar Formatter
  const insertFormatting = (tagOpen, tagClose, defaultText = 'text') => {
    const textarea = descTextareaRef.current;
    if (!textarea) {
      setCatForm(prev => ({
        ...prev,
        description: (prev.description || '') + `${tagOpen}${defaultText}${tagClose}`
      }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = catForm.description || '';
    const selected = text.substring(start, end) || defaultText;
    const newText = text.substring(0, start) + tagOpen + selected + tagClose + text.substring(end);
    setCatForm(prev => ({ ...prev, description: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 10);
  };

  // Submit Category (Create or Edit)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategoryId 
        ? `/api/admin/categories/${editingCategoryId}` 
        : '/api/admin/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: editingCategoryId 
            ? `Category "${catForm.title}" updated successfully!` 
            : `Category "${catForm.title}" created with ${catForm.images.length} images & video!` 
        });
        setIsAddingCategory(false);
        setEditingCategoryId(null);
        setCatForm(initialCatForm);
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      } else {
        alert(data.message || "Failed to save category.");
      }
    } catch {
      alert("Error saving category.");
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCatForm({
      title: cat.title || '',
      subtitle: cat.subtitle || '',
      description: cat.description || '',
      badge: cat.badge || 'New',
      accent: cat.accent || '#C86D51',
      iconName: cat.iconName || 'Sparkles',
      difficulty: cat.difficulty || 'All Levels',
      coverImage: cat.coverImage || '',
      images: Array.isArray(cat.images) && cat.images.length > 0 
        ? cat.images 
        : [cat.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'],
      videoUrl: cat.videoUrl || ''
    });
    setIsAddingCategory(true);
  };

  const handleCancelCategoryForm = () => {
    setIsAddingCategory(false);
    setEditingCategoryId(null);
    setCatForm(initialCatForm);
  };

  // Filtered Categories for Table List
  const filteredCategories = categories.filter(c => 
    !categorySearch ||
    c.title?.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.subtitle?.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.id?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Delete Category
  const handleDeleteCategory = async (id, title) => {
    if (!window.confirm(`Delete category "${title}" and all its classes?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Category "${title}" removed.` });
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      }
    } catch {
      alert("Error deleting category.");
    }
  };

  // Package Management Handlers
  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      const features = pkgForm.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        name: pkgForm.name,
        tagline: pkgForm.tagline,
        price: Number(pkgForm.price),
        billing: pkgForm.billing,
        popular: Boolean(pkgForm.popular),
        color: pkgForm.color,
        badge: pkgForm.badge,
        features,
        includesCertification: Boolean(pkgForm.includesCertification)
      };

      const url = editingPackageId 
        ? `/api/admin/packages/${editingPackageId}` 
        : '/api/admin/packages';
      const method = editingPackageId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ 
          type: 'success', 
          message: editingPackageId 
            ? `Package "${pkgForm.name}" updated successfully!` 
            : `Package "${pkgForm.name}" created!` 
        });
        setIsAddingPackage(false);
        setEditingPackageId(null);
        setPkgForm(initialPkgForm);
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      } else {
        alert(data.message || "Failed to save package.");
      }
    } catch {
      alert("Error saving package.");
    }
  };

  const handleEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setPkgForm({
      name: pkg.name || '',
      tagline: pkg.tagline || '',
      price: pkg.price !== undefined ? pkg.price : 29,
      billing: pkg.billing || 'one-time payment',
      popular: Boolean(pkg.popular),
      color: pkg.color || '#C86D51',
      badge: pkg.badge || '',
      featuresText: Array.isArray(pkg.features) ? pkg.features.join('\n') : '',
      includesCertification: Boolean(pkg.includesCertification)
    });
    setIsAddingPackage(true);
  };

  const handleDeletePackage = async (id, name) => {
    if (!window.confirm(`Delete package tier "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Package "${name}" deleted.` });
        if (onRefreshData) onRefreshData();
        fetchCRMData();
      }
    } catch {
      alert("Error deleting package.");
    }
  };

  const handleCancelPackageForm = () => {
    setIsAddingPackage(false);
    setEditingPackageId(null);
    setPkgForm(initialPkgForm);
  };

  // Product Management Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const imagesList = productForm.imagesText
        ? productForm.imagesText.split('\n').map(s => s.trim()).filter(Boolean)
        : [productForm.coverImage];

      const payload = {
        title: productForm.title,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        stock: Number(productForm.stock),
        badge: productForm.badge,
        description: productForm.description,
        coverImage: productForm.coverImage,
        images: imagesList,
        specs: {
          Material: productForm.material,
          Dimensions: productForm.dimensions,
          Care: productForm.care
        }
      };

      const url = editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: editingProductId ? `Product "${productForm.title}" updated!` : `Product "${productForm.title}" created!` });
        setIsAddingProduct(false);
        setEditingProductId(null);
        setProductForm(initialProductForm);
        fetchCRMData();
        if (onRefreshData) onRefreshData();
      } else {
        alert(data.message || "Failed to save product.");
      }
    } catch {
      alert("Error saving product.");
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      title: prod.title || '',
      category: prod.category || 'Plushies & Toys',
      price: prod.price !== undefined ? prod.price : '',
      originalPrice: prod.originalPrice || '',
      stock: prod.stock !== undefined ? prod.stock : 10,
      badge: prod.badge || '',
      description: prod.description || '',
      coverImage: prod.coverImage || '',
      imagesText: Array.isArray(prod.images) ? prod.images.join('\n') : '',
      material: prod.specs?.Material || '100% Organic Cotton',
      dimensions: prod.specs?.Dimensions || '6 x 4 inches',
      care: prod.specs?.Care || 'Spot clean with gentle soap'
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Delete product "${title}" from shop?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Product "${title}" deleted.` });
        fetchCRMData();
        if (onRefreshData) onRefreshData();
      }
    } catch {
      alert("Error deleting product.");
    }
  };

  // Product Order Fulfillment Updater
  const handleUpdateProductOrderStatus = async (id, fulfillmentStatus, trackingNumber) => {
    try {
      const res = await fetch(`/api/admin/crm/product-orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus, trackingNumber })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Order #${id} status updated to ${fulfillmentStatus}!` });
        fetchCRMData();
      }
    } catch {
      alert("Error updating order status.");
    }
  };

  // Custom Commission Status Updater
  const handleUpdateCustomOrderStatus = async (id, status, artisanNotes, estimatedQuote) => {
    try {
      const res = await fetch(`/api/admin/crm/custom-orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, artisanNotes, estimatedQuote })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Commission #${id} updated!` });
        setEditingCustomOrder(null);
        fetchCRMData();
      }
    } catch {
      alert("Error updating custom order.");
    }
  };

  // Settings Handlers
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsForm(data.data);
        setFeedback({ type: 'success', message: 'Store & Branding settings saved successfully!' });
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3000);
        if (onUpdateSettings) onUpdateSettings(data.data);
        if (onRefreshData) onRefreshData();
      } else {
        alert(data.message || 'Failed to save settings.');
      }
    } catch {
      alert('Network error saving settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetSettings = async () => {
    if (!window.confirm("Reset all store, currency, GST, and branding settings to factory defaults?")) return;
    const defaults = {
      companyName: "Tishaya Petal & Loop",
      tagline: "Handmade • Unique • With Love ♡",
      contactPhone: "+91 9099962395",
      whatsappNumber: "919099962395",
      contactEmail: "anjalicrochetknit@gmail.com",
      address: "2039, 12th Avenue, Gaur City 2, Greater Noida West, Uttar Pradesh 201009",
      logo: "/logo.png",
      favicon: "/favicon.ico",
      currencySymbol: "₹",
      currencyCode: "INR",
      currencyPosition: "prefix",
      gstRate: 5,
      gstName: "GST (India)",
      enableGst: true,
      taxMode: "exclusive",
      defaultDiscount: 10,
      promoCode: "ANJALI10",
      promoBannerText: "🌸 Tishaya Petal & Loop ♡ Bouquets from ₹499 & Keychains from ₹40 · WhatsApp: +91 9099962395 · Pan-India Delivery!",
      showPromoBanner: true,
      freeShippingThreshold: 499,
      supportHours: "Open Every Day: 10:00 AM – 9:00 PM IST"
    };
    setSettingsForm(defaults);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaults)
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Settings reset to factory defaults.' });
        if (onUpdateSettings) onUpdateSettings(data.data);
        if (onRefreshData) onRefreshData();
      }
    } catch {
      alert("Error resetting settings.");
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => 
    !orderSearch ||
    o.studentName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.studentEmail?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.packageName?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Filtered Submissions
  const filteredSubmissions = submissions.filter(s => 
    !subSearch ||
    s.studentName?.toLowerCase().includes(subSearch.toLowerCase()) ||
    (s.credentialId && s.credentialId.toLowerCase().includes(subSearch.toLowerCase()))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: '#FAF7F2', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. LOGIN SCREEN IF NOT AUTHENTICATED */}
      {!adminUser ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(rgba(96, 169, 223, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-subtle)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <img 
                src="/logo.png" 
                alt="Petal & Loop" 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.75rem', border: '2px solid var(--color-primary)' }} 
              />
              <span className="badge badge-terracotta" style={{ marginBottom: '0.4rem' }}>
                Admin & CRM Portal
              </span>
              <h2 style={{ fontSize: '1.75rem', margin: '0.2rem 0' }}>
                Petal & Loop CRM
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Sign in to manage categories, video classes, student enrollments, and certification records.
              </p>
            </div>

            {/* Quick Demo Credentials Info Box */}
            <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '12px', padding: '0.85rem 1rem', border: '1px solid rgba(217,155,67,0.3)', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <strong style={{ color: '#9E7333' }}>Demo Login Details:</strong>
                <button
                  type="button"
                  onClick={() => { setLoginEmail('admin@petalloop.com'); setLoginPassword('admin123'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Auto Fill ✓
                </button>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Email: <strong style={{ color: 'var(--text-main)' }}>admin@petalloop.com</strong>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Password: <strong style={{ color: 'var(--text-main)' }}>admin123</strong>
              </div>
            </div>

            {loginError && (
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Admin Email
                </label>
                <input 
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@petalloop.com"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Password
                </label>
                <input 
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="admin123"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="btn btn-primary"
                style={{ padding: '0.85rem', width: '100%', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.5rem' }}
              >
                {loggingIn ? "Verifying..." : "Sign In to CRM Dashboard →"}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ArrowLeft size={14} /> Back to Student Website
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* 2. AUTHENTICATED CRM DASHBOARD */
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top CRM Appbar */}
          <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src="/logo.png" 
                alt="Petal & Loop" 
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-primary)' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                    Petal & Loop Admin CRM
                  </h1>
                  <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>
                    {adminUser.role || 'Super Admin'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Logged in as: {adminUser.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {dbInfo && (
                <span 
                  title={`Host: ${dbInfo.host} | DB: ${dbInfo.database}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: dbInfo.connected ? '#E8F5E9' : '#FFF3E0',
                    color: dbInfo.connected ? '#2E7D32' : '#E65100',
                    border: `1px solid ${dbInfo.connected ? '#C8E6C9' : '#FFE0B2'}`,
                    borderRadius: '20px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: dbInfo.connected ? '#2E7D32' : '#E65100' }}></span>
                  🐬 {dbInfo.engine} ({dbInfo.database})
                </span>
              )}

              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem' }}
              >
                <ArrowLeft size={14} /> View Student Website
              </button>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </header>

          {/* CRM Body Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '240px 1fr' }}>
            
            {/* Left CRM Sidebar */}
            <aside style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid var(--border-subtle)', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', padding: '0 0.75rem 0.5rem' }}>
                CRM Modules
              </div>

              <button
                onClick={() => setCrmTab('dashboard')}
                className={`tab-btn ${crmTab === 'dashboard' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Layers size={16} /> Dashboard & Stats
              </button>

              <button
                onClick={() => setCrmTab('courses')}
                className={`tab-btn ${crmTab === 'courses' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Film size={16} /> Crochet Classes ({courses.length})
              </button>

              <button
                onClick={() => setCrmTab('categories')}
                className={`tab-btn ${crmTab === 'categories' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <FolderPlus size={16} /> Categories ({categories.length})
              </button>

              <button
                onClick={() => setCrmTab('packages')}
                className={`tab-btn ${crmTab === 'packages' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Package size={16} /> Packages & Tiers ({packagesList.length})
              </button>

              <button
                onClick={() => setCrmTab('products')}
                className={`tab-btn ${crmTab === 'products' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <ShoppingBag size={16} /> Products & Shop ({productsList.length})
              </button>

              <button
                onClick={() => setCrmTab('shop-orders')}
                className={`tab-btn ${crmTab === 'shop-orders' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Truck size={16} /> Shop Orders ({productOrdersList.length})
              </button>

              <button
                onClick={() => setCrmTab('custom-orders')}
                className={`tab-btn ${crmTab === 'custom-orders' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Sparkles size={16} color="var(--color-honey)" /> Custom Commissions ({customOrdersList.length})
              </button>

              <button
                onClick={() => setCrmTab('orders')}
                className={`tab-btn ${crmTab === 'orders' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Users size={16} /> Student Enrollments ({orders.length})
              </button>

              <button
                onClick={() => setCrmTab('certifications')}
                className={`tab-btn ${crmTab === 'certifications' ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
              >
                <Award size={16} /> 80% MCQ Certs ({submissions.length})
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.65rem 0' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', padding: '0 0.75rem 0.25rem' }}>
                Store & Branding
              </div>

              <button
                onClick={() => setCrmTab('slider')}
                className={`tab-btn ${crmTab === 'slider' ? 'active' : ''}`}
                style={{ 
                  width: '100%', 
                  justifyContent: 'flex-start', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem',
                  backgroundColor: crmTab === 'slider' ? 'var(--color-primary)' : 'transparent',
                  color: crmTab === 'slider' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: crmTab === 'slider' ? 700 : 500
                }}
              >
                <SlidersHorizontal size={16} /> Home Sliders ({slidesList.length})
              </button>

              <button
                onClick={() => setCrmTab('settings')}
                className={`tab-btn ${crmTab === 'settings' ? 'active' : ''}`}
                style={{ 
                  width: '100%', 
                  justifyContent: 'flex-start', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem',
                  backgroundColor: crmTab === 'settings' ? 'var(--color-primary)' : 'transparent',
                  color: crmTab === 'settings' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: crmTab === 'settings' ? 700 : 500
                }}
              >
                <Settings size={16} /> Store Settings
              </button>

              <button
                onClick={() => setCrmTab('faqs')}
                className={`tab-btn ${crmTab === 'faqs' ? 'active' : ''}`}
                style={{ 
                  width: '100%', 
                  justifyContent: 'flex-start', 
                  padding: '0.65rem 0.85rem', 
                  fontSize: '0.85rem',
                  backgroundColor: crmTab === 'faqs' ? 'var(--color-primary)' : 'transparent',
                  color: crmTab === 'faqs' ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: crmTab === 'faqs' ? 700 : 500
                }}
              >
                <HelpCircle size={16} /> FAQs Manager ({faqsList.length})
              </button>
            </aside>

            {/* Right Main CRM Content */}
            <main style={{ padding: '2rem', overflowY: 'auto' }}>
              
              {feedback && (
                <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, backgroundColor: feedback.type === 'success' ? 'var(--color-sage-light)' : 'var(--color-primary-light)', color: feedback.type === 'success' ? 'var(--color-sage)' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{feedback.message}</span>
                  <button onClick={() => setFeedback(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>×</button>
                </div>
              )}

              {/* MODULE 1: DASHBOARD STATS */}
              {crmTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Guild Performance & CRM Overview</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time student engagement, package revenue, and certification metrics.</p>
                  </div>

                  {/* 5 KPI Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DollarSign size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                        ${stats.totalRevenue}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-sage)', fontWeight: 700 }}>From {orders.length} Package Purchases</span>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Students</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                        {stats.totalStudents}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered crafters</span>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Crochet Classes</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-honey-light)', color: '#9E7333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Film size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                        {courses.length}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Across {categories.length} disciplines</span>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Certs Awarded</span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-sage-light)', color: 'var(--color-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Award size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--color-sage)' }}>
                        {stats.certificatesIssued}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-sage)', fontWeight: 700 }}>≥80% MCQ Passers</span>
                    </div>

                  </div>

                  {/* Recent Orders Preview */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Recent Student Enrollments</h3>
                      <button onClick={() => setCrmTab('orders')} className="btn btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                        View All Orders →
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '0.65rem' }}>Order ID</th>
                            <th style={{ padding: '0.65rem' }}>Student</th>
                            <th style={{ padding: '0.65rem' }}>Package</th>
                            <th style={{ padding: '0.65rem' }}>Amount</th>
                            <th style={{ padding: '0.65rem' }}>Date</th>
                            <th style={{ padding: '0.65rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 700 }}>{o.id}</td>
                              <td style={{ padding: '0.65rem' }}>
                                <strong>{o.studentName}</strong>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.studentEmail}</div>
                              </td>
                              <td style={{ padding: '0.65rem' }}>{o.packageName}</td>
                              <td style={{ padding: '0.65rem', fontWeight: 800, color: 'var(--color-primary)' }}>${o.price}</td>
                              <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>{o.date}</td>
                              <td style={{ padding: '0.65rem' }}>
                                <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>{o.status || 'Active'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* MODULE 2: CROCHET CLASSES MANAGEMENT */}
              {crmTab === 'courses' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Crochet Classes & Video Studio</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add video links, step-by-step illustrated guides, stitch formulas, and delete classes.</p>
                    </div>

                    <button
                      onClick={() => setIsAddingCourse(!isAddingCourse)}
                      className="btn btn-primary"
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
                    >
                      <Plus size={16} /> {isAddingCourse ? "Close Form" : "Add New Crochet Class"}
                    </button>
                  </div>

                  {/* Add Class Form Modal / Collapsible */}
                  {isAddingCourse && (
                    <form onSubmit={handleCreateCourse} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.75rem', border: '2px solid var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Create Step-by-Step Crochet Class</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Class Title *</label>
                          <input 
                            type="text" required placeholder="e.g. Chubby Strawberry Amigurumi"
                            value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Category *</label>
                          <select 
                            value={courseForm.categoryId} onChange={e => setCourseForm({ ...courseForm, categoryId: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFFFFF' }}
                          >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Difficulty</label>
                          <select value={courseForm.level} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}>
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Duration</label>
                          <input type="text" placeholder="e.g. 45 mins" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Package Requirement</label>
                          <select value={courseForm.package} onChange={e => setCourseForm({ ...courseForm, package: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}>
                            <option value="Free">Free</option>
                            <option value="Starter">Starter</option>
                            <option value="Artisan">Artisan</option>
                            <option value="Master">Master</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>YouTube Video URL *</label>
                          <input type="text" required placeholder="https://www.youtube.com/watch?v=..." value={courseForm.videoUrl} onChange={e => setCourseForm({ ...courseForm, videoUrl: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Cover Photo URL *</label>
                          <input type="text" required value={courseForm.coverImage} onChange={e => setCourseForm({ ...courseForm, coverImage: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>Project Description *</label>
                        <textarea rows={2} required value={courseForm.summary} onChange={e => setCourseForm({ ...courseForm, summary: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} />
                      </div>

                      {/* Steps Builder */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Step-by-Step Guide ({courseForm.steps.length} Steps)</h4>
                          <button type="button" onClick={handleAddStep} className="btn btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                            <Plus size={14} /> Add Step
                          </button>
                        </div>

                        {courseForm.steps.map((st, i) => (
                          <div key={i} style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <strong>Step {i + 1}</strong>
                              {courseForm.steps.length > 1 && (
                                <button type="button" onClick={() => handleRemoveStep(i)} style={{ color: '#D32F2F', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Remove</button>
                              )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <input type="text" placeholder="Step Title" value={st.title} onChange={e => handleUpdateStep(i, 'title', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }} />
                              <input type="text" placeholder="Timestamp (e.g. 02:15)" value={st.timestamp} onChange={e => handleUpdateStep(i, 'timestamp', e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }} />
                            </div>
                            <input type="text" placeholder="Stitch Formula (e.g. R1: 6 SC in MR)" value={st.stitchFormula} onChange={e => handleUpdateStep(i, 'stitchFormula', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.82rem', marginBottom: '0.5rem', fontFamily: 'monospace' }} />
                            <textarea rows={2} placeholder="Step Instructions" value={st.instruction} onChange={e => handleUpdateStep(i, 'instruction', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }} />
                          </div>
                        ))}
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', fontWeight: 700 }}>
                        Publish Crochet Class Now →
                      </button>
                    </form>
                  )}

                  {/* Classes Table */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.65rem' }}>Cover</th>
                          <th style={{ padding: '0.65rem' }}>Class Title</th>
                          <th style={{ padding: '0.65rem' }}>Category</th>
                          <th style={{ padding: '0.65rem' }}>Level</th>
                          <th style={{ padding: '0.65rem' }}>Package</th>
                          <th style={{ padding: '0.65rem' }}>Steps</th>
                          <th style={{ padding: '0.65rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.65rem' }}>
                              <img src={c.coverImage} alt={c.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                            </td>
                            <td style={{ padding: '0.65rem' }}>
                              <strong>{c.title}</strong>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.duration}</div>
                            </td>
                            <td style={{ padding: '0.65rem' }}>{c.categoryId}</td>
                            <td style={{ padding: '0.65rem' }}>{c.level}</td>
                            <td style={{ padding: '0.65rem' }}>
                              <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>{c.package}</span>
                            </td>
                            <td style={{ padding: '0.65rem', fontWeight: 700 }}>{c.steps?.length || 0} Steps</td>
                            <td style={{ padding: '0.65rem' }}>
                              <button onClick={() => handleDeleteCourse(c.id, c.title)} style={{ color: '#D32F2F', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* MODULE 3: CATEGORIES MANAGEMENT (TABLE LIST + MULTI-IMAGES + VIDEO + RICH TEXT) */}
              {crmTab === 'categories' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Categories & Disciplines CRM</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Manage crochet curriculums with multiple gallery images, intro videos, and rich formatted descriptions.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Search Bar */}
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                        <input 
                          type="text" placeholder="Search categories..."
                          value={categorySearch} onChange={e => setCategorySearch(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                        />
                      </div>

                      {/* View Mode Switcher */}
                      <div style={{ display: 'flex', backgroundColor: 'var(--border-subtle)', borderRadius: '10px', padding: '3px' }}>
                        <button
                          type="button"
                          onClick={() => setCategoryViewMode('table')}
                          title="Table List View"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: categoryViewMode === 'table' ? 700 : 500,
                            backgroundColor: categoryViewMode === 'table' ? '#FFFFFF' : 'transparent',
                            color: categoryViewMode === 'table' ? 'var(--color-primary)' : 'var(--text-muted)',
                            boxShadow: categoryViewMode === 'table' ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <LayoutList size={15} /> Table List
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryViewMode('grid')}
                          title="Card Grid View"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: categoryViewMode === 'grid' ? 700 : 500,
                            backgroundColor: categoryViewMode === 'grid' ? '#FFFFFF' : 'transparent',
                            color: categoryViewMode === 'grid' ? 'var(--color-primary)' : 'var(--text-muted)',
                            boxShadow: categoryViewMode === 'grid' ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <LayoutGrid size={15} /> Grid Cards
                        </button>
                      </div>

                      {/* Add Category Toggle Button */}
                      <button
                        onClick={() => {
                          if (isAddingCategory) {
                            handleCancelCategoryForm();
                          } else {
                            setIsAddingCategory(true);
                            setEditingCategoryId(null);
                            setCatForm(initialCatForm);
                          }
                        }}
                        className="btn btn-sage"
                        style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                      >
                        {isAddingCategory ? <X size={15} /> : <Plus size={15} />}
                        {isAddingCategory ? "Close Form" : "Add New Category"}
                      </button>
                    </div>
                  </div>

                  {/* FORM: CREATE OR EDIT CATEGORY (WITH MULTI-IMAGES, VIDEO & RICH TEXT) */}
                  {isAddingCategory && (
                    <form 
                      onSubmit={handleSaveCategory} 
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: '20px', 
                        padding: '1.75rem', 
                        border: '2px solid var(--color-sage)', 
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.25rem' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                        <div>
                          <span className="badge badge-sage" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                            {editingCategoryId ? 'Edit Discipline' : 'New Discipline Studio'}
                          </span>
                          <h3 style={{ fontSize: '1.35rem', margin: '0.2rem 0' }}>
                            {editingCategoryId ? `Edit Category: ${catForm.title}` : "Add Category with Multiple Images & Video"}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelCategoryForm}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* General Info Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Category Title *
                          </label>
                          <input 
                            type="text" required 
                            placeholder="e.g. Vintage Tapestry & Filet" 
                            value={catForm.title} 
                            onChange={e => setCatForm({ ...catForm, title: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Subtitle
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Intricate pictorial lace & grids" 
                            value={catForm.subtitle} 
                            onChange={e => setCatForm({ ...catForm, subtitle: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Badge Label
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Trending, Masterclass, Classic" 
                            value={catForm.badge} 
                            onChange={e => setCatForm({ ...catForm, badge: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Accent Theme Color
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <input 
                              type="color" 
                              value={catForm.accent} 
                              onChange={e => setCatForm({ ...catForm, accent: e.target.value })} 
                              style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }} 
                            />
                            <input 
                              type="text" 
                              value={catForm.accent} 
                              onChange={e => setCatForm({ ...catForm, accent: e.target.value })} 
                              style={{ width: '100px', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', fontFamily: 'monospace' }} 
                            />
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: catForm.accent, border: '2px solid #FFF', boxShadow: 'var(--shadow-sm)' }} />
                          </div>
                        </div>
                      </div>

                      {/* Icon & Difficulty Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Category Icon
                          </label>
                          <select 
                            value={catForm.iconName} 
                            onChange={e => setCatForm({ ...catForm, iconName: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                          >
                            <option value="Sparkles">✨ Sparkles (Amigurumi)</option>
                            <option value="Shirt">👕 Shirt (Wearables)</option>
                            <option value="Grid">▦ Grid (Granny Squares)</option>
                            <option value="Home">🏠 Home (Décor)</option>
                            <option value="ShoppingBag">🛍️ Shopping Bag (Accessories)</option>
                            <option value="BookOpen">📖 Book (Beginner Lab)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Difficulty Curriculum
                          </label>
                          <select 
                            value={catForm.difficulty} 
                            onChange={e => setCatForm({ ...catForm, difficulty: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', backgroundColor: '#FFF' }}
                          >
                            <option value="Absolute Beginner">Absolute Beginner</option>
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="All Levels">All Levels</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced Mastery</option>
                          </select>
                        </div>
                      </div>

                      {/* SECTION 1: MULTIPLE IMAGES GALLERY */}
                      <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h4 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <ImageIcon size={18} color="var(--color-primary)" /> Category Image Gallery ({catForm.images.length} Photos)
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                              Add multiple photos for product showcases, stitch close-ups, and student project inspiration.
                            </p>
                          </div>
                        </div>

                        {/* Image Input and Quick Presets */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                          <input 
                            type="text" 
                            placeholder="Enter image URL (https://...)"
                            value={newImageUrl} 
                            onChange={e => setNewImageUrl(e.target.value)} 
                            style={{ flex: 1, minWidth: '240px', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }} 
                          />
                          <button
                            type="button"
                            onClick={() => handleAddImage(newImageUrl)}
                            className="btn btn-secondary"
                            style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                          >
                            <Plus size={14} /> Add to Gallery
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Quick Presets:</span>
                          <button 
                            type="button"
                            onClick={() => handleAddImage('https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80')}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                          >
                            + Cotton Skein
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleAddImage('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80')}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                          >
                            + Wooden Hooks
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleAddImage('https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80')}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                          >
                            + Sunflower Motif
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleAddImage('https://images.unsplash.com/photo-1608248597359-5613531b46a7?auto=format&fit=crop&w=800&q=80')}
                            className="btn btn-secondary" style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                          >
                            + Cozy Cardigan
                          </button>
                        </div>

                        {/* Thumbnail Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                          {catForm.images.map((imgUrl, idx) => {
                            const isPrimary = catForm.coverImage === imgUrl;
                            return (
                              <div 
                                key={idx} 
                                style={{ 
                                  position: 'relative', 
                                  backgroundColor: '#FFFFFF', 
                                  borderRadius: '10px', 
                                  padding: '0.4rem', 
                                  border: isPrimary ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                                  boxShadow: isPrimary ? '0 0 0 2px rgba(96, 169, 223, 0.25)' : 'none'
                                }}
                              >
                                <img 
                                  src={imgUrl} 
                                  alt={`Category visual ${idx + 1}`} 
                                  style={{ width: '100%', height: '85px', objectFit: 'cover', borderRadius: '6px' }} 
                                />
                                {isPrimary && (
                                  <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: 'var(--color-primary)', color: '#FFF', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                    ★ Primary Cover
                                  </span>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                                  {!isPrimary ? (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPrimaryCover(imgUrl)}
                                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, padding: 0 }}
                                    >
                                      Make Cover
                                    </button>
                                  ) : (
                                    <span style={{ fontSize: '0.68rem', color: 'var(--color-sage)', fontWeight: 700 }}>Cover</span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    title="Remove this photo"
                                    style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, padding: 0 }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION 2: VIDEO STUDIO & PREVIEW */}
                      <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                          <h4 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Film size={18} color="#D99B43" /> Category Intro / Overview Video
                          </h4>
                          <button
                            type="button"
                            onClick={() => setCatForm({ ...catForm, videoUrl: 'https://www.youtube.com/watch?v=z5cKzWdOaI4' })}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                          >
                            Insert Demo Video
                          </button>
                        </div>
                        
                        <input 
                          type="text" 
                          placeholder="YouTube Video URL (e.g. https://www.youtube.com/watch?v=z5cKzWdOaI4 or embed link)"
                          value={catForm.videoUrl} 
                          onChange={e => setCatForm({ ...catForm, videoUrl: e.target.value })} 
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', marginBottom: '0.75rem' }} 
                        />

                        {catForm.videoUrl && (
                          <div style={{ marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', maxWidth: '480px', backgroundColor: '#000' }}>
                            <iframe
                              src={getEmbedUrl(catForm.videoUrl)}
                              title="Category Video Preview"
                              style={{ width: '100%', height: '220px', border: 'none', display: 'block' }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                            <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#1A1817', color: '#E8DED1', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Play size={12} color="var(--color-primary)" /> Live Video Preview Player
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SECTION 3: DESCRIPTION RICH TEXT EDITOR */}
                      <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h4 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Edit3 size={18} color="var(--color-sage)" /> Curriculum Description (Rich Text Editor)
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                              Format curriculum outlines with bold emphasis, bullet points, headers, and pro tips.
                            </p>
                          </div>

                          {/* Editor Tabs: Code vs Live Preview */}
                          <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                            <button
                              type="button"
                              onClick={() => setRichEditorTab('editor')}
                              style={{
                                padding: '0.3rem 0.65rem',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: richEditorTab === 'editor' ? 'var(--color-sage)' : 'transparent',
                                color: richEditorTab === 'editor' ? '#FFF' : 'var(--text-muted)'
                              }}
                            >
                              Editor Code
                            </button>
                            <button
                              type="button"
                              onClick={() => setRichEditorTab('preview')}
                              style={{
                                padding: '0.3rem 0.65rem',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: richEditorTab === 'preview' ? 'var(--color-sage)' : 'transparent',
                                color: richEditorTab === 'preview' ? '#FFF' : 'var(--text-muted)'
                              }}
                            >
                              Live Styled Preview
                            </button>
                          </div>
                        </div>

                        {/* Rich Text Editor Toolbar */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#FFFFFF', padding: '0.4rem 0.5rem', borderRadius: '8px', border: '1px solid var(--border-strong)', marginBottom: '0.5rem' }}>
                          <button
                            type="button"
                            title="Bold [strong]"
                            onClick={() => insertFormatting('<strong>', '</strong>', 'bold text')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: '0.78rem' }}
                          >
                            <Bold size={14} />
                          </button>
                          <button
                            type="button"
                            title="Italic [em]"
                            onClick={() => insertFormatting('<em>', '</em>', 'italic text')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', fontStyle: 'italic', fontSize: '0.78rem' }}
                          >
                            <Italic size={14} />
                          </button>
                          <button
                            type="button"
                            title="Underline [u]"
                            onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'underline', fontSize: '0.78rem' }}
                          >
                            <Underline size={14} />
                          </button>

                          <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

                          <button
                            type="button"
                            title="Heading 2 [h2]"
                            onClick={() => insertFormatting('<h2>', '</h2>\n', 'Category Overview')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            H2
                          </button>
                          <button
                            type="button"
                            title="Heading 3 [h3]"
                            onClick={() => insertFormatting('<h3>', '</h3>\n', 'Key Techniques')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          >
                            H3
                          </button>

                          <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

                          <button
                            type="button"
                            title="Bullet List [ul/li]"
                            onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n  <li>Second key technique</li>\n</ul>\n', 'First key technique')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}
                          >
                            <List size={14} /> List
                          </button>
                          <button
                            type="button"
                            title="Pro Tip Quote [blockquote]"
                            onClick={() => insertFormatting('<blockquote>', '</blockquote>\n', 'Pro Tip: Maintain consistent tension on turning chains.')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}
                          >
                            <Quote size={14} /> Tip
                          </button>
                          <button
                            type="button"
                            title="Stitch Code [code]"
                            onClick={() => insertFormatting('<code>', '</code>', 'R1: 6 SC in MR')}
                            style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#FAF7F2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem' }}
                          >
                            <Code size={14} /> Stitch
                          </button>

                          <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

                          {/* Quick Template Insertions */}
                          <button
                            type="button"
                            onClick={() => setCatForm(prev => ({ ...prev, description: '<p>Master <strong>essential 3D crochet sculpting</strong>, invisible decreases, seamless tension, and assembling plush toys.</p><ul><li>Zero-gap invisible decreases</li><li>Safety-eye anchoring & stuffing shaping</li><li>Seamless embroidery details</li></ul><blockquote>Artisan Tip: Use locking stitch markers on every round.</blockquote>' }))}
                            style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', border: 'none', background: 'var(--color-primary-light)', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
                          >
                            Amigurumi Template
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatForm(prev => ({ ...prev, description: '<p>Learn <em>gauge swatching</em>, sizing measurements, ribbing elasticity, and drape control for <strong>luxurious wearable garments</strong>.</p><ul><li>Custom body measurements & sizing charts</li><li>Elastic ribbed cuffs and collared necklines</li><li>Blocking & invisible mattress stitch seaming</li></ul><blockquote>Artisan Tip: Always steam-block before final assembly.</blockquote>' }))}
                            style={{ padding: '0.3rem 0.55rem', borderRadius: '4px', border: 'none', background: 'var(--color-sage-light)', color: 'var(--color-sage)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
                          >
                            Wearables Template
                          </button>
                        </div>

                        {/* Editor Textarea */}
                        {richEditorTab === 'editor' ? (
                          <textarea 
                            ref={descTextareaRef}
                            rows={6} 
                            required 
                            placeholder="Type or format your description HTML here..." 
                            value={catForm.description} 
                            onChange={e => setCatForm({ ...catForm, description: e.target.value })} 
                            style={{ 
                              width: '100%', 
                              padding: '0.75rem', 
                              borderRadius: '8px', 
                              border: '1px solid var(--border-strong)', 
                              fontSize: '0.85rem', 
                              fontFamily: 'Consolas, Monaco, monospace', 
                              lineHeight: '1.5',
                              backgroundColor: '#FFFFFF'
                            }} 
                          />
                        ) : (
                          /* Live Rendered Styled Preview */
                          <div 
                            style={{ 
                              backgroundColor: '#FFFFFF', 
                              borderRadius: '8px', 
                              padding: '1rem', 
                              border: '1px solid var(--color-sage)', 
                              minHeight: '140px',
                              fontSize: '0.88rem',
                              lineHeight: '1.6'
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-sage)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                              ✓ Live Rendered Description Preview:
                            </div>
                            <div 
                              dangerouslySetInnerHTML={{ __html: catForm.description || '<p style="color: #999;">No description entered yet.</p>' }} 
                            />
                          </div>
                        )}
                      </div>

                      {/* Submit Actions */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <button 
                          type="button" 
                          onClick={handleCancelCategoryForm}
                          className="btn btn-secondary" 
                          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-sage" 
                          style={{ padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.88rem' }}
                        >
                          {editingCategoryId ? 'Update Category ✓' : 'Save & Publish Category ✓'}
                        </button>
                      </div>

                    </form>
                  )}

                  {/* CATEGORIES TABLE LIST VIEW (USER REQUEST: "category should be table list") */}
                  {categoryViewMode === 'table' ? (
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Showing {filteredCategories.length} Categories ({categories.length} Total Registered)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-sage)', fontWeight: 700 }}>
                          ✓ Table List Mode Active
                        </span>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Cover & Gallery</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Category Name & Slug</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Theme & Badge</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Curriculum Description</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Media Assets</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Classes</th>
                            <th style={{ padding: '0.75rem 0.65rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.map(c => {
                            const photoCount = Array.isArray(c.images) ? c.images.length : (c.coverImage ? 1 : 0);
                            const hasVideo = Boolean(c.videoUrl);

                            return (
                              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                {/* 1. Cover & Gallery Preview */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div 
                                      style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${c.accent || 'var(--color-primary)'}`, flexShrink: 0, cursor: 'pointer' }}
                                      onClick={() => setSelectedPreviewCat(c)}
                                      title="Click to view full media preview"
                                    >
                                      <img 
                                        src={c.coverImage} 
                                        alt={c.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      />
                                      {hasVideo && (
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', padding: '1px 3px', borderRadius: '4px 0 0 0', fontSize: '0.6rem' }}>
                                          ▶
                                        </div>
                                      )}
                                    </div>
                                    {photoCount > 1 && (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        +{photoCount - 1} more
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 2. Title & Slug */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)', display: 'block' }}>
                                    {c.title}
                                  </strong>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {c.subtitle}
                                  </div>
                                  <code style={{ fontSize: '0.68rem', backgroundColor: 'var(--bg-canvas)', padding: '1px 5px', borderRadius: '4px', color: 'var(--color-primary)', marginTop: '2px', display: 'inline-block' }}>
                                    #{c.id}
                                  </code>
                                </td>

                                {/* 3. Theme & Badge */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c.accent || '#EE6D88' }} />
                                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace' }}>{c.accent}</span>
                                  </div>
                                  <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>
                                    {c.badge}
                                  </span>
                                </td>

                                {/* 4. Rich Text Description Snippet */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle', maxWidth: '320px' }}>
                                  <div 
                                    style={{ 
                                      fontSize: '0.78rem', 
                                      color: 'var(--text-main)', 
                                      maxHeight: '48px', 
                                      overflow: 'hidden', 
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      lineHeight: '1.4'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: c.description }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPreviewCat(c)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, padding: 0, marginTop: '2px' }}
                                  >
                                    View Full Rich Text →
                                  </button>
                                </td>

                                {/* 5. Media Assets */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                      <ImageIcon size={13} color="var(--color-primary)" /> {photoCount} Photos
                                    </span>
                                    {hasVideo ? (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--color-sage)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Film size={13} /> Video Ready
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        No Video
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 6. Classes Count */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <span className="badge badge-sage" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                    {c.projectCount} Classes
                                  </span>
                                </td>

                                {/* 7. Actions */}
                                <td style={{ padding: '0.75rem 0.65rem', verticalAlign: 'middle' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <button 
                                      onClick={() => setSelectedPreviewCat(c)} 
                                      title="Preview Media & Video"
                                      style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, fontSize: '0.78rem' }}
                                    >
                                      <Eye size={14} /> Preview
                                    </button>
                                    <button 
                                      onClick={() => handleEditCategory(c)} 
                                      title="Edit category, images, video & description"
                                      style={{ color: 'var(--color-sage)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, fontSize: '0.78rem' }}
                                    >
                                      <Edit3 size={14} /> Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteCategory(c.id, c.title)} 
                                      title="Delete category"
                                      style={{ color: '#D32F2F', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, fontSize: '0.78rem' }}
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* ALTERNATIVE: GRID CARDS VIEW */
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
                      {filteredCategories.map(c => {
                        const photoCount = Array.isArray(c.images) ? c.images.length : (c.coverImage ? 1 : 0);
                        const hasVideo = Boolean(c.videoUrl);

                        return (
                          <div 
                            key={c.id} 
                            style={{ 
                              backgroundColor: '#FFFFFF', 
                              borderRadius: '16px', 
                              padding: '1.25rem', 
                              border: '1px solid var(--border-subtle)', 
                              borderLeft: `6px solid ${c.accent || 'var(--color-primary)'}`, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              justifyContent: 'space-between',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <div>
                              <div style={{ position: 'relative', height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', cursor: 'pointer' }} onClick={() => setSelectedPreviewCat(c)}>
                                <img src={c.coverImage} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '0.3rem' }}>
                                  <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    📷 {photoCount} Photos
                                  </span>
                                  {hasVideo && (
                                    <span style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                      ▶ Video
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>{c.badge}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{c.projectCount} Classes</span>
                              </div>
                              <h4 style={{ fontSize: '1.15rem', margin: '0.2rem 0' }}>{c.title}</h4>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{c.subtitle}</div>
                              <div 
                                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, maxHeight: '60px', overflow: 'hidden' }}
                                dangerouslySetInnerHTML={{ __html: c.description }}
                              />
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button onClick={() => setSelectedPreviewCat(c)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>
                                👁️ Media
                              </button>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleEditCategory(c)} style={{ color: 'var(--color-sage)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteCategory(c.id, c.title)} style={{ color: '#D32F2F', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* MODULE 3.5: PACKAGES & MEMBERSHIP TIERS MANAGEMENT (AS PER HOME PAGE) */}
              {crmTab === 'packages' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Membership Packages & Tuition Tiers</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Manage student packages, free community tiers, pricing, certification privileges, and feature bundles.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* View Mode Toggle */}
                      <div style={{ display: 'flex', backgroundColor: 'var(--border-subtle)', borderRadius: '10px', padding: '3px' }}>
                        <button
                          type="button"
                          onClick={() => setPackageViewMode('cards')}
                          title="Cards View (As per Home Page)"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: packageViewMode === 'cards' ? 700 : 500,
                            backgroundColor: packageViewMode === 'cards' ? '#FFFFFF' : 'transparent',
                            color: packageViewMode === 'cards' ? 'var(--color-primary)' : 'var(--text-muted)',
                            boxShadow: packageViewMode === 'cards' ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <LayoutGrid size={15} /> Cards (Home Page View)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPackageViewMode('table')}
                          title="Table List View"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: packageViewMode === 'table' ? 700 : 500,
                            backgroundColor: packageViewMode === 'table' ? '#FFFFFF' : 'transparent',
                            color: packageViewMode === 'table' ? 'var(--color-primary)' : 'var(--text-muted)',
                            boxShadow: packageViewMode === 'table' ? 'var(--shadow-sm)' : 'none'
                          }}
                        >
                          <LayoutList size={15} /> Table List
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (isAddingPackage) {
                            handleCancelPackageForm();
                          } else {
                            setIsAddingPackage(true);
                            setEditingPackageId(null);
                            setPkgForm(initialPkgForm);
                          }
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                      >
                        {isAddingPackage ? <X size={15} /> : <Plus size={15} />}
                        {isAddingPackage ? "Close Form" : "Add New Package"}
                      </button>
                    </div>
                  </div>

                  {/* FORM: ADD OR EDIT PACKAGE */}
                  {isAddingPackage && (
                    <form 
                      onSubmit={handleSavePackage}
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: '20px', 
                        padding: '1.75rem', 
                        border: '2px solid var(--color-primary)', 
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1.25rem' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                        <div>
                          <span className="badge badge-terracotta" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                            {editingPackageId ? 'Edit Package Tier' : 'New Membership Package'}
                          </span>
                          <h3 style={{ fontSize: '1.35rem', margin: '0.2rem 0' }}>
                            {editingPackageId ? `Edit Package: ${pkgForm.name}` : "Create Membership Package"}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={handleCancelPackageForm}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.25rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Package Name *
                          </label>
                          <input 
                            type="text" required 
                            placeholder="e.g. Master Craftsman VIP"
                            value={pkgForm.name} 
                            onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Tagline / Subtitle
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Everything to become proficient"
                            value={pkgForm.tagline} 
                            onChange={e => setPkgForm({ ...pkgForm, tagline: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Price ($ USD) *
                          </label>
                          <input 
                            type="number" min="0" required 
                            placeholder="0 for Free, or amount in USD"
                            value={pkgForm.price} 
                            onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Billing Terms
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. one-time payment, free forever, lifetime access"
                            value={pkgForm.billing} 
                            onChange={e => setPkgForm({ ...pkgForm, billing: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Badge Tag (Optional)
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Best Value • Most Enrolled, 100% Free"
                            value={pkgForm.badge} 
                            onChange={e => setPkgForm({ ...pkgForm, badge: e.target.value })} 
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }} 
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            Accent Theme Color
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <input 
                              type="color" 
                              value={pkgForm.color} 
                              onChange={e => setPkgForm({ ...pkgForm, color: e.target.value })} 
                              style={{ width: '42px', height: '42px', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: 0 }} 
                            />
                            <input 
                              type="text" 
                              value={pkgForm.color} 
                              onChange={e => setPkgForm({ ...pkgForm, color: e.target.value })} 
                              style={{ width: '110px', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', fontFamily: 'monospace' }} 
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={pkgForm.includesCertification} 
                              onChange={e => setPkgForm({ ...pkgForm, includesCertification: e.target.checked })} 
                            />
                            <span>Includes 80% MCQ Exam & Certificate</span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={pkgForm.popular} 
                              onChange={e => setPkgForm({ ...pkgForm, popular: e.target.checked })} 
                            />
                            <span>Mark as Popular / Featured Highlight</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                            Package Feature Benefits (One feature per line) *
                          </label>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => setPkgForm({ ...pkgForm, featuresText: "Access to Beginner Stitch Lab Foundations\nFree Project Masterclasses (e.g. Chubby Honeybee)\nStep-by-step Video Player with Timestamps\nDownloadable Stitch Abbreviations Key\nPractice MCQ Quiz Mode (No Card Required)" })}
                              className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.68rem' }}
                            >
                              Preset: Free Tier
                            </button>
                            <button
                              type="button"
                              onClick={() => setPkgForm({ ...pkgForm, featuresText: "Full Access to ALL 6 Categories (Amigurumi, Wearables, etc.)\n28+ Step-by-Step Video Masterclasses\nPrintable Pattern PDFs with Charts & Row Trackers\nHigh-Resolution Visual Stitch Breakdown\n1 Official Master Artisan MCQ Certification Attempt\nDownloadable Verified Credential on passing (≥ 80%)" })}
                              className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.68rem' }}
                            >
                              Preset: Artisan Tier
                            </button>
                          </div>
                        </div>
                        <textarea 
                          rows={5} 
                          required
                          value={pkgForm.featuresText} 
                          onChange={e => setPkgForm({ ...pkgForm, featuresText: e.target.value })} 
                          placeholder="Line 1: Full Access to all classes&#10;Line 2: PDF pattern downloads&#10;Line 3: Verified certificate"
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', lineHeight: '1.5' }} 
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <button 
                          type="button" 
                          onClick={handleCancelPackageForm}
                          className="btn btn-secondary" 
                          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          style={{ padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.88rem' }}
                        >
                          {editingPackageId ? 'Update Package Tier ✓' : 'Save & Publish Package ✓'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* VIEW 1: DISPLAY AS PER HOME PAGE (SINGLE-ROW PACKAGES GRID) */}
                  {packageViewMode === 'cards' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Displaying {packagesList.length} Membership Tiers in Single-Row Card Layout (Exact Home Page Presentation)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                          ✓ Home Page Single-Row Layout Active
                        </span>
                      </div>

                      <div className="packages-tier-grid" style={{ marginBottom: '1rem' }}>
                        {packagesList.map((pkg) => {
                          const isFree = Number(pkg.price) === 0;

                          return (
                            <div
                              key={pkg.id}
                              className={`package-card ${pkg.popular ? 'selected' : ''}`}
                              style={{ 
                                borderColor: pkg.popular ? 'var(--color-primary)' : 'var(--border-subtle)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                            >
                              {pkg.badge && (
                                <div style={{ 
                                  position: 'absolute', 
                                  top: '-11px', 
                                  left: '50%', 
                                  transform: 'translateX(-50%)', 
                                  backgroundColor: pkg.popular ? 'var(--color-primary)' : (pkg.color || '#8B6F8E'), 
                                  color: '#FFFFFF', 
                                  fontSize: '0.68rem', 
                                  fontWeight: 800, 
                                  padding: '0.2rem 0.75rem', 
                                  borderRadius: '999px', 
                                  whiteSpace: 'nowrap',
                                  boxShadow: 'var(--shadow-sm)'
                                }}>
                                  {pkg.badge}
                                </div>
                              )}

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                  <h4 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>
                                    {pkg.name}
                                  </h4>
                                </div>

                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                  {pkg.tagline}
                                </p>

                                <div style={{ marginBottom: '1.25rem' }}>
                                  <span className="package-price-number" style={{ color: isFree ? 'var(--color-sage)' : 'var(--color-primary)' }}>
                                    ${pkg.price}
                                  </span>
                                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                                    / {pkg.billing}
                                  </span>
                                </div>

                                {pkg.includesCertification ? (
                                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-honey-light)', border: '1px solid rgba(217,155,67,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#9E7333', fontWeight: 700, marginBottom: '1rem' }}>
                                    <Award size={15} /> Includes 80% MCQ Exam & Cert
                                  </div>
                                ) : (
                                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                    <BookOpen size={15} /> Foundational Practice Only
                                  </div>
                                )}

                                {/* Features List */}
                                <ul className="package-features-list">
                                  {pkg.features?.map((feat, idx) => (
                                    <li key={idx}>
                                      <Check size={14} className="feature-check" />
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Admin Management Toolbar on Card */}
                              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleEditPackage(pkg)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                >
                                  <Edit3 size={13} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                                  style={{ background: 'none', border: 'none', color: '#D32F2F', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* VIEW 2: TABLE LIST VIEW */
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '0.65rem' }}>Package Name & Tagline</th>
                            <th style={{ padding: '0.65rem' }}>Price & Billing</th>
                            <th style={{ padding: '0.65rem' }}>Badge Tag</th>
                            <th style={{ padding: '0.65rem' }}>Certification</th>
                            <th style={{ padding: '0.65rem' }}>Features Count</th>
                            <th style={{ padding: '0.65rem' }}>Status</th>
                            <th style={{ padding: '0.65rem' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {packagesList.map(pkg => (
                            <tr key={pkg.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '0.65rem' }}>
                                <strong style={{ fontSize: '0.92rem' }}>{pkg.name}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pkg.tagline}</div>
                              </td>
                              <td style={{ padding: '0.65rem' }}>
                                <strong style={{ color: Number(pkg.price) === 0 ? 'var(--color-sage)' : 'var(--color-primary)', fontSize: '1rem' }}>
                                  ${pkg.price}
                                </strong>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{pkg.billing}</div>
                              </td>
                              <td style={{ padding: '0.65rem' }}>
                                {pkg.badge ? (
                                  <span className="badge badge-terracotta" style={{ fontSize: '0.68rem' }}>
                                    {pkg.badge}
                                  </span>
                                ) : '—'}
                              </td>
                              <td style={{ padding: '0.65rem' }}>
                                {pkg.includesCertification ? (
                                  <span className="badge badge-honey" style={{ fontSize: '0.68rem' }}>
                                    ✓ 80% MCQ Cert
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No Certificate</span>
                                )}
                              </td>
                              <td style={{ padding: '0.65rem', fontWeight: 700 }}>
                                {pkg.features?.length || 0} Benefits
                              </td>
                              <td style={{ padding: '0.65rem' }}>
                                <span className={`badge ${pkg.popular ? 'badge-sage' : 'badge-terracotta'}`} style={{ fontSize: '0.65rem' }}>
                                  {pkg.popular ? 'Featured' : 'Standard'}
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <button
                                    onClick={() => handleEditPackage(pkg)}
                                    style={{ color: 'var(--color-sage)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                                    style={{ color: '#D32F2F', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}

              {/* MODULE 4: STUDENT ORDERS / ENROLLMENTS */}
              {crmTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Student Enrollments & Orders</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All package purchases, student details, order revenue, and access status.</p>
                    </div>

                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                      <input 
                        type="text" placeholder="Search student or email..."
                        value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.65rem' }}>Order ID</th>
                          <th style={{ padding: '0.65rem' }}>Student Name</th>
                          <th style={{ padding: '0.65rem' }}>Email Address</th>
                          <th style={{ padding: '0.65rem' }}>Enrolled Package</th>
                          <th style={{ padding: '0.65rem' }}>Price</th>
                          <th style={{ padding: '0.65rem' }}>Purchase Date</th>
                          <th style={{ padding: '0.65rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(o => (
                          <tr key={o.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 700 }}>{o.id}</td>
                            <td style={{ padding: '0.65rem', fontWeight: 700 }}>{o.studentName}</td>
                            <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>{o.studentEmail}</td>
                            <td style={{ padding: '0.65rem' }}>
                              <span className="badge badge-honey" style={{ fontSize: '0.7rem' }}>{o.packageName}</span>
                            </td>
                            <td style={{ padding: '0.65rem', fontWeight: 800, color: 'var(--color-primary)' }}>${o.price}</td>
                            <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>{o.date}</td>
                            <td style={{ padding: '0.65rem' }}>
                              <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>{o.status || 'Active'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* MODULE 5: MCQ CERTIFICATIONS */}
              {crmTab === 'certifications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0 }}>80% MCQ Assessment Submissions</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Records of all examination attempts, verification codes, scores, and honor distinctions.</p>
                    </div>

                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                      <input 
                        type="text" placeholder="Search candidate or cert ID..."
                        value={subSearch} onChange={e => setSubSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.65rem' }}>Submission ID</th>
                          <th style={{ padding: '0.65rem' }}>Student Name</th>
                          <th style={{ padding: '0.65rem' }}>Exam Score</th>
                          <th style={{ padding: '0.65rem' }}>Result</th>
                          <th style={{ padding: '0.65rem' }}>Credential Verification ID</th>
                          <th style={{ padding: '0.65rem' }}>Date</th>
                          <th style={{ padding: '0.65rem' }}>Honors Distinction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map(s => (
                          <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 700 }}>{s.id}</td>
                            <td style={{ padding: '0.65rem', fontWeight: 700 }}>{s.studentName}</td>
                            <td style={{ padding: '0.65rem', fontWeight: 800, color: s.passed ? 'var(--color-sage)' : 'var(--color-primary)' }}>
                              {s.score}%
                            </td>
                            <td style={{ padding: '0.65rem' }}>
                              <span className={`badge ${s.passed ? 'badge-sage' : 'badge-terracotta'}`} style={{ fontSize: '0.65rem' }}>
                                {s.passed ? 'Passed (≥80%)' : 'Failed'}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem', fontFamily: 'monospace', color: s.credentialId ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                              {s.credentialId || '—'}
                            </td>
                            <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>{s.date}</td>
                            <td style={{ padding: '0.65rem', fontSize: '0.8rem', color: s.passed ? 'var(--color-sage)' : 'var(--text-muted)', fontWeight: 600 }}>
                              {s.honors}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 6: PRODUCTS & SHOP INVENTORY */}
              {crmTab === 'products' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Handcrafted Shop Products & Kits</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your artisan catalog, pricing, inventory stocks, photos, and specs.</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ position: 'relative', width: '220px' }}>
                        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                        <input 
                          type="text" 
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={e => setProductSearch(e.target.value)}
                          style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setEditingProductId(null);
                          setProductForm(initialProductForm);
                          setIsAddingProduct(true);
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}
                      >
                        <Plus size={15} /> Add New Product
                      </button>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.75rem' }}>Product</th>
                          <th style={{ padding: '0.75rem' }}>Category</th>
                          <th style={{ padding: '0.75rem' }}>Price</th>
                          <th style={{ padding: '0.75rem' }}>Inventory Stock</th>
                          <th style={{ padding: '0.75rem' }}>Badge</th>
                          <th style={{ padding: '0.75rem' }}>Rating</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsList
                          .filter(p => !productSearch || p.title?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((prod) => (
                            <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img src={prod.coverImage} alt={prod.title} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{prod.title}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {prod.id}</div>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{prod.category}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <strong style={{ color: 'var(--color-primary)' }}>${Number(prod.price).toFixed(2)}</strong>
                                {prod.originalPrice && <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textDecoration: 'line-through', marginLeft: '0.35rem' }}>${Number(prod.originalPrice).toFixed(2)}</span>}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <span style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: prod.stock <= 5 ? '#FEECEB' : 'var(--color-sage-light)', color: prod.stock <= 5 ? '#E05A47' : 'var(--color-sage)' }}>
                                  {prod.stock <= 0 ? "Out of Stock" : `${prod.stock} units`}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {prod.badge ? <span className="badge badge-terracotta" style={{ fontSize: '0.68rem' }}>{prod.badge}</span> : '—'}
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--color-honey)', fontWeight: 700 }}>
                                ★ {prod.rating || 5.0} ({prod.reviewsCount || 1})
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                  <button
                                    onClick={() => handleEditProduct(prod)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add / Edit Product Modal Form */}
                  {isAddingProduct && (
                    <div className="modal-overlay" style={{ zIndex: 1200, padding: '1rem', overflowY: 'auto' }}>
                      <div className="modal-content" style={{ maxWidth: '720px', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                          <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>
                            {editingProductId ? "Edit Product" : "Add Handcrafted Product"}
                          </h3>
                          <button onClick={() => setIsAddingProduct(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
                        </div>

                        <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Product Title *</label>
                              <input 
                                type="text"
                                value={productForm.title}
                                onChange={e => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Chunky Honeybee Plushie"
                                required
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category *</label>
                              <select
                                value={productForm.category}
                                onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              >
                                <option value="Plushies & Toys">Plushies & Toys</option>
                                <option value="Wearables">Wearables</option>
                                <option value="Home Living">Home Living</option>
                                <option value="Tools & Kits">Tools & Kits</option>
                                <option value="Yarn & Skeins">Yarn & Skeins</option>
                                <option value="Bags & Accessories">Bags & Accessories</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Price ($) *</label>
                              <input 
                                type="number" step="0.01" min="0"
                                value={productForm.price}
                                onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                required
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Original ($)</label>
                              <input 
                                type="number" step="0.01" min="0"
                                value={productForm.originalPrice}
                                onChange={e => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                                placeholder="For discount"
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Stock Quantity</label>
                              <input 
                                type="number" min="0"
                                value={productForm.stock}
                                onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Badge Tag</label>
                              <input 
                                type="text"
                                value={productForm.badge}
                                onChange={e => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                                placeholder="Best Seller"
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Primary Cover Photo URL *</label>
                            <input 
                              type="url"
                              value={productForm.coverImage}
                              onChange={e => setProductForm(prev => ({ ...prev, coverImage: e.target.value }))}
                              required
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Additional Photo URLs (one per line)</label>
                            <textarea 
                              rows={2}
                              value={productForm.imagesText}
                              onChange={e => setProductForm(prev => ({ ...prev, imagesText: e.target.value }))}
                              placeholder="https://images.unsplash.com/..."
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Product Description</label>
                            <textarea 
                              rows={3}
                              value={productForm.description}
                              onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Material Spec</label>
                              <input 
                                type="text"
                                value={productForm.material}
                                onChange={e => setProductForm(prev => ({ ...prev, material: e.target.value }))}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Dimensions Spec</label>
                              <input 
                                type="text"
                                value={productForm.dimensions}
                                onChange={e => setProductForm(prev => ({ ...prev, dimensions: e.target.value }))}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Care Instructions</label>
                              <input 
                                type="text"
                                value={productForm.care}
                                onChange={e => setProductForm(prev => ({ ...prev, care: e.target.value }))}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                            <button type="button" onClick={() => setIsAddingProduct(false)} className="btn btn-secondary">
                              Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                              {editingProductId ? "Update Product" : "Save Product"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* MODULE 7: SHOP ORDERS */}
              {crmTab === 'shop-orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Customer Shop Orders</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage product orders, payments, shipment tracking numbers, and delivery statuses.</p>
                    </div>

                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                      <input 
                        type="text" 
                        placeholder="Search order ID or customer..."
                        value={prodOrderSearch}
                        onChange={e => setProdOrderSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.75rem' }}>Order ID</th>
                          <th style={{ padding: '0.75rem' }}>Date</th>
                          <th style={{ padding: '0.75rem' }}>Customer Details</th>
                          <th style={{ padding: '0.75rem' }}>Items Ordered</th>
                          <th style={{ padding: '0.75rem' }}>Total Paid</th>
                          <th style={{ padding: '0.75rem' }}>Tracking #</th>
                          <th style={{ padding: '0.75rem' }}>Fulfillment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productOrdersList
                          .filter(o => !prodOrderSearch || o.id?.toLowerCase().includes(prodOrderSearch.toLowerCase()) || o.customerName?.toLowerCase().includes(prodOrderSearch.toLowerCase()))
                          .map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                                {order.id}
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{order.date}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: 800 }}>{order.customerName}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  {order.items?.map((it, idx) => (
                                    <span key={idx} style={{ fontSize: '0.78rem' }}>
                                      {it.quantity}x {it.title}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <strong style={{ color: 'var(--color-primary)' }}>${Number(order.total).toFixed(2)}</strong>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-sage)', fontWeight: 700 }}>● {order.paymentStatus}</div>
                              </td>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                                {order.trackingNumber || '—'}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <select
                                  value={order.fulfillmentStatus || 'Processing'}
                                  onChange={(e) => handleUpdateProductOrderStatus(order.id, e.target.value, order.trackingNumber)}
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    backgroundColor: order.fulfillmentStatus === 'Delivered' ? 'var(--color-sage-light)' : (order.fulfillmentStatus === 'Shipped' ? '#FAF7F2' : '#FFFDF9'),
                                    color: order.fulfillmentStatus === 'Delivered' ? 'var(--color-sage)' : 'var(--text-main)'
                                  }}
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="In Production">In Production</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 8: CUSTOM COMMISSIONS */}
              {crmTab === 'custom-orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Custom Crochet Commissions</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review custom customer requests, reference photos, yarn choices, and manage production stages.</p>
                    </div>

                    <div style={{ position: 'relative', width: '260px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                      <input 
                        type="text" 
                        placeholder="Search commissions..."
                        value={customOrderSearch}
                        onChange={e => setCustomOrderSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', borderRadius: '999px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  {/* Custom Orders Table */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid var(--border-subtle)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.75rem' }}>Commission ID</th>
                          <th style={{ padding: '0.75rem' }}>Customer</th>
                          <th style={{ padding: '0.75rem' }}>Item & Vision</th>
                          <th style={{ padding: '0.75rem' }}>Yarn & Palette</th>
                          <th style={{ padding: '0.75rem' }}>Reference Image</th>
                          <th style={{ padding: '0.75rem' }}>Quote & Deposit</th>
                          <th style={{ padding: '0.75rem' }}>Artisan Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customOrdersList
                          .filter(c => !customOrderSearch || c.id?.toLowerCase().includes(customOrderSearch.toLowerCase()) || c.customerName?.toLowerCase().includes(customOrderSearch.toLowerCase()) || c.title?.toLowerCase().includes(customOrderSearch.toLowerCase()))
                          .map(comm => (
                            <tr key={comm.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--color-primary)' }}>
                                {comm.id}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontWeight: 800 }}>{comm.customerName}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{comm.customerEmail}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{comm.customerPhone}</div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <strong style={{ color: 'var(--text-main)' }}>{comm.title || comm.itemType}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {comm.itemType}</div>
                                {comm.personalizationText && (
                                  <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                                    Tag: "{comm.personalizationText}"
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{comm.yarnPreference}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{comm.colorPalette}</div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                {comm.referenceImage ? (
                                  <a href={comm.referenceImage} target="_blank" rel="noreferrer">
                                    <img src={comm.referenceImage} alt="Ref" style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />
                                  </a>
                                ) : (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>No photo</span>
                                )}
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div>Quote: <strong>${Number(comm.estimatedQuote).toFixed(2)}</strong></div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--color-sage)', fontWeight: 800 }}>
                                  Deposit: ${Number(comm.depositPaid).toFixed(2)} (Paid)
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <select
                                  value={comm.status || 'Under Review'}
                                  onChange={(e) => handleUpdateCustomOrderStatus(comm.id, e.target.value, comm.artisanNotes, comm.estimatedQuote)}
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    backgroundColor: comm.status === 'Completed' ? 'var(--color-sage-light)' : (comm.status === 'In Production' ? 'var(--color-honey-light)' : '#FAF7F2'),
                                    color: comm.status === 'Completed' ? 'var(--color-sage)' : (comm.status === 'In Production' ? '#9E7333' : 'var(--text-main)')
                                  }}
                                >
                                  <option value="Under Review">Under Review</option>
                                  <option value="Approved">Approved</option>
                                  <option value="In Production">In Production</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Shipped">Shipped</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* MODULE 9: STORE & BRAND SETTINGS TAB */}
              {crmTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Top Bar with Title & Save Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1.25rem 1.75rem', borderRadius: '18px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span className="badge badge-terracotta" style={{ fontSize: '0.68rem' }}>Master Store Settings</span>
                        {settingsSavedSuccess && (
                          <span className="badge badge-sage" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Check size={12} /> Saved Live
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontSize: '1.65rem', margin: '0.15rem 0', fontFamily: 'var(--font-serif)' }}>
                        Store, Brand & Financial Configuration
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Configure currency symbols, GST tax percentage, discount codes, customer helpline, company name, logo & favicon.
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={handleResetSettings}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem 1.15rem', fontSize: '0.85rem' }}
                      >
                        Reset Defaults
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(96, 169, 223, 0.35)' }}
                      >
                        {isSavingSettings ? <RefreshCw size={16} className="spinning" /> : <CheckCircle2 size={16} />}
                        <span>{isSavingSettings ? "Saving Settings..." : "Save Store Settings"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Settings Grid: 2 Columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>

                    {/* CARD 1: COMPANY & BRAND IDENTITY */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                          <Globe size={18} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Company & Brand Identity</h3>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Brand name, slogan, company logo and browser favicon</div>
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Company / Brand Name *
                        </label>
                        <input 
                          type="text" 
                          value={settingsForm.companyName || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                          placeholder="e.g. Petal & Loop Academy & Artisan Studio"
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                        />
                      </div>

                      {/* Tagline */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Company Tagline / Slogan
                        </label>
                        <input 
                          type="text" 
                          value={settingsForm.tagline || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                          placeholder="e.g. Handmade with a little love • Master Artisan Crochet"
                          style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                        />
                      </div>

                      {/* Logo URL with Live Preview & Presets */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Company Logo URL
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--border-strong)', overflow: 'hidden', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img 
                              src={settingsForm.logo || '/logo.png'} 
                              alt="Logo Preview" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = '/logo.png'; }}
                            />
                          </div>
                          <input 
                            type="text" 
                            value={settingsForm.logo || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                            placeholder="/logo.png or https://example.com/logo.png"
                            style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>
                        {/* Quick Presets for Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logo: '/logo.png' })}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', borderRadius: '999px' }}
                          >
                            🌸 Default Petal & Loop
                          </button>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, logo: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=200&q=80' })}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', borderRadius: '999px' }}
                          >
                            🧸 Artisan Honeybee
                          </button>
                        </div>
                      </div>

                      {/* Favicon URL with Live Preview & Presets */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Browser Favicon URL
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-strong)', overflow: 'hidden', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img 
                              src={settingsForm.favicon || '/favicon.ico'} 
                              alt="Favicon Preview" 
                              style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                              onError={(e) => { e.target.src = '/favicon.ico'; }}
                            />
                          </div>
                          <input 
                            type="text" 
                            value={settingsForm.favicon || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, favicon: e.target.value })}
                            placeholder="/favicon.ico or https://example.com/icon.png"
                            style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, favicon: '/favicon.ico' })}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', borderRadius: '999px' }}
                          >
                            🧶 Default Skein Favicon
                          </button>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, favicon: '/logo.png' })}
                            className="btn btn-secondary"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', borderRadius: '999px' }}
                          >
                            🌸 Logo as Favicon
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* CARD 2: CURRENCY & GST / TAXATION */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-honey-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9E7333' }}>
                          <Coins size={18} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Currency & GST / Taxation</h3>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pricing symbols, tax rates, GST calculation, and format</div>
                        </div>
                      </div>

                      {/* Currency Symbol & Quick Selectors */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Store Currency Symbol *
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            value={settingsForm.currencySymbol || '$'}
                            onChange={e => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                            placeholder="$"
                            style={{ width: '100px', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '1.1rem', fontWeight: 800, textAlign: 'center', color: 'var(--color-primary)' }}
                          />
                          <div style={{ flex: 1, display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {[
                              { sym: '$', code: 'USD' },
                              { sym: '₹', code: 'INR' },
                              { sym: '€', code: 'EUR' },
                              { sym: '£', code: 'GBP' },
                              { sym: 'CA$', code: 'CAD' },
                              { sym: 'A$', code: 'AUD' },
                              { sym: '¥', code: 'JPY' }
                            ].map(c => (
                              <button
                                key={c.sym}
                                type="button"
                                onClick={() => setSettingsForm({ ...settingsForm, currencySymbol: c.sym, currencyCode: c.code })}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '8px',
                                  border: settingsForm.currencySymbol === c.sym ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                                  backgroundColor: settingsForm.currencySymbol === c.sym ? 'var(--color-primary-light)' : '#FFFFFF',
                                  color: settingsForm.currencySymbol === c.sym ? 'var(--color-primary)' : 'var(--text-main)',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >
                                {c.sym} ({c.code})
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Currency Code & Placement */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            ISO Currency Code
                          </label>
                          <input 
                            type="text" 
                            value={settingsForm.currencyCode || 'USD'}
                            onChange={e => setSettingsForm({ ...settingsForm, currencyCode: e.target.value.toUpperCase() })}
                            placeholder="USD, INR, EUR..."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Symbol Position
                          </label>
                          <select 
                            value={settingsForm.currencyPosition || 'prefix'}
                            onChange={e => setSettingsForm({ ...settingsForm, currencyPosition: e.target.value })}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                          >
                            <option value="prefix">Prefix (e.g. {settingsForm.currencySymbol}28.00)</option>
                            <option value="suffix">Suffix (e.g. 28.00 {settingsForm.currencySymbol})</option>
                          </select>
                        </div>
                      </div>

                      {/* GST / TAXATION SETTINGS */}
                      <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>Enable GST / Sales Tax</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automatically calculate tax in cart & checkout</span>
                          </div>
                          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                            <input 
                              type="checkbox"
                              checked={!!settingsForm.enableGst}
                              onChange={e => setSettingsForm({ ...settingsForm, enableGst: e.target.checked })}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute', cursor: 'pointer', inset: 0,
                              backgroundColor: settingsForm.enableGst ? 'var(--color-sage)' : '#D0C9C0',
                              borderRadius: '34px', transition: '0.2s'
                            }}>
                              <span style={{
                                position: 'absolute', content: '""', height: '20px', width: '20px', left: settingsForm.enableGst ? '24px' : '3px', bottom: '3px',
                                backgroundColor: '#FFFFFF', borderRadius: '50%', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }} />
                            </span>
                          </label>
                        </div>

                        {settingsForm.enableGst && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                Tax Display Label
                              </label>
                              <input 
                                type="text"
                                value={settingsForm.gstName || 'GST'}
                                onChange={e => setSettingsForm({ ...settingsForm, gstName: e.target.value })}
                                placeholder="GST, VAT, Sales Tax"
                                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                GST / Tax Rate (%)
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.5"
                                  value={settingsForm.gstRate !== undefined ? settingsForm.gstRate : 5}
                                  onChange={e => setSettingsForm({ ...settingsForm, gstRate: Number(e.target.value) || 0 })}
                                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.9rem', fontWeight: 700 }}
                                />
                                <span style={{ fontWeight: 800, color: 'var(--color-sage)' }}>%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* CARD 3: DISCOUNTS & PROMOTIONS */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-sage-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-sage)' }}>
                          <Percent size={18} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Discounts, Vouchers & Delivery</h3>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Site-wide promotion rates, voucher codes, and free shipping</div>
                        </div>
                      </div>

                      {/* Default Discount & Promo Voucher */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Default Store Discount (%)
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={settingsForm.defaultDiscount !== undefined ? settingsForm.defaultDiscount : 10}
                              onChange={e => setSettingsForm({ ...settingsForm, defaultDiscount: Number(e.target.value) || 0 })}
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem', fontWeight: 700 }}
                            />
                            <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>%</span>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Featured Promo Code
                          </label>
                          <input 
                            type="text"
                            value={settingsForm.promoCode || 'PETAL10'}
                            onChange={e => setSettingsForm({ ...settingsForm, promoCode: e.target.value.toUpperCase() })}
                            placeholder="PETAL10"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}
                          />
                        </div>
                      </div>

                      {/* Free Shipping Threshold */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Free Shipping Minimum Threshold ({settingsForm.currencySymbol || '$'})
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>{settingsForm.currencySymbol || '$'}</span>
                          <input 
                            type="number"
                            min="0"
                            value={settingsForm.freeShippingThreshold !== undefined ? settingsForm.freeShippingThreshold : 50}
                            onChange={e => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                          />
                        </div>
                      </div>

                      {/* Announcement Bar Toggle & Text */}
                      <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '0.88rem', display: 'block' }}>Display Top Announcement Strip</strong>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Displays highlighted offer banner across all pages</span>
                          </div>
                          <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                            <input 
                              type="checkbox"
                              checked={!!settingsForm.showPromoBanner}
                              onChange={e => setSettingsForm({ ...settingsForm, showPromoBanner: e.target.checked })}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute', cursor: 'pointer', inset: 0,
                              backgroundColor: settingsForm.showPromoBanner ? 'var(--color-primary)' : '#D0C9C0',
                              borderRadius: '34px', transition: '0.2s'
                            }}>
                              <span style={{
                                position: 'absolute', content: '""', height: '20px', width: '20px', left: settingsForm.showPromoBanner ? '24px' : '3px', bottom: '3px',
                                backgroundColor: '#FFFFFF', borderRadius: '50%', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }} />
                            </span>
                          </label>
                        </div>

                        {settingsForm.showPromoBanner && (
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                              Announcement Message
                            </label>
                            <input 
                              type="text"
                              value={settingsForm.promoBannerText || ''}
                              onChange={e => setSettingsForm({ ...settingsForm, promoBannerText: e.target.value })}
                              placeholder="🌸 Spring Guild Offer: Use PETAL10 for 10% off!"
                              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-strong)', fontSize: '0.82rem' }}
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* CARD 4: CONTACT & CUSTOMER SUPPORT */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.75rem', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                          <Phone size={18} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>Contact & Customer Support</h3>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Customer helpline, support email, studio address, and hours</div>
                        </div>
                      </div>

                      {/* Contact Phone & Email */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Customer Contact Phone *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <Phone size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input 
                              type="text"
                              value={settingsForm.contactPhone || ''}
                              onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                              placeholder="+1 (800) 482-LOOP"
                              style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.1rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                            Official Support Email *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <Mail size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input 
                              type="email"
                              value={settingsForm.contactEmail || ''}
                              onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                              placeholder="hello@petalloop.com"
                              style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.1rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Physical Address */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Physical Craft Studio / Business Address
                        </label>
                        <div style={{ position: 'relative' }}>
                          <MapPin size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-subtle)' }} />
                          <textarea 
                            rows={2}
                            value={settingsForm.address || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                            placeholder="742 Evergreen Studio, Craft District, Portland, OR 97201"
                            style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.1rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem', resize: 'vertical' }}
                          />
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                          Support Working Hours
                        </label>
                        <input 
                          type="text"
                          value={settingsForm.supportHours || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, supportHours: e.target.value })}
                          placeholder="Mon - Fri: 9:00 AM - 6:00 PM EST"
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                        />
                      </div>

                    </div>

                  </div>

                  {/* CARD 5: REAL-TIME STOREFRONT LIVE PREVIEW */}
                  <div style={{ backgroundColor: '#FAF7F2', borderRadius: '22px', padding: '1.75rem', border: '2px dashed var(--color-primary)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={18} color="var(--color-primary)" />
                        <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                          Live Customer Storefront & Financial Preview
                        </h3>
                      </div>
                      <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Real-time Rendering</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                      
                      {/* Brand Header Preview */}
                      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>
                          Header & Brand Badge
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={settingsForm.logo || '/logo.png'} 
                            alt="Preview" 
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                              {settingsForm.companyName || "Petal & Loop"}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {settingsForm.tagline || "Handmade with a little love"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calculation Breakdown Preview */}
                      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>
                          Sample Cart Math ({settingsForm.currencySymbol || '$'}100 Item)
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Sample Handcrafted Item:</span>
                          <strong>{settingsForm.currencySymbol || '$'}100.00</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', color: 'var(--color-primary)' }}>
                          <span>Discount ({settingsForm.defaultDiscount || 0}%):</span>
                          <strong>-{settingsForm.currencySymbol || '$'}{((100 * (settingsForm.defaultDiscount || 0)) / 100).toFixed(2)}</strong>
                        </div>
                        {settingsForm.enableGst && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', color: 'var(--color-sage)' }}>
                            <span>{settingsForm.gstName || 'GST'} ({settingsForm.gstRate || 0}%):</span>
                            <strong>+{settingsForm.currencySymbol || '$'}{(( (100 - (100 * (settingsForm.defaultDiscount || 0) / 100)) * (settingsForm.gstRate || 0) ) / 100).toFixed(2)}</strong>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', fontWeight: 800, fontSize: '0.9rem' }}>
                          <span>Customer Pays:</span>
                          <span style={{ color: 'var(--color-primary)' }}>
                            {settingsForm.currencyPosition === 'suffix' 
                              ? `${( (100 - (100 * (settingsForm.defaultDiscount || 0) / 100)) * (1 + (settingsForm.enableGst ? (settingsForm.gstRate || 0) / 100 : 0)) ).toFixed(2)} ${settingsForm.currencySymbol || '$'}`
                              : `${settingsForm.currencySymbol || '$'}${( (100 - (100 * (settingsForm.defaultDiscount || 0) / 100)) * (1 + (settingsForm.enableGst ? (settingsForm.gstRate || 0) / 100 : 0)) ).toFixed(2)}`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Footer Support Preview */}
                      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', padding: '1rem', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.5rem' }}>
                          Footer Helpline & Address
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                          <Phone size={13} color="var(--color-primary)" />
                          <span>{settingsForm.contactPhone || "+1 (800) 482-LOOP"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                          <Mail size={13} color="var(--color-sage)" />
                          <span>{settingsForm.contactEmail || "hello@petalloop.com"}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          <MapPin size={13} />
                          <span>{settingsForm.address || "Studio Craft District"}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* 9. HOME PAGE IMAGE SLIDER MODULE */}
              {crmTab === 'slider' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  
                  {/* Header & Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#FFFFFF', padding: '1.5rem 2rem', borderRadius: '20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                        <SlidersHorizontal size={22} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                          Home Page Hero Sliders
                        </h2>
                        <span className="badge badge-terracotta">
                          {slidesList.length} Slides ({slidesList.filter(s => s.active !== false).length} Active)
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                        Manage dynamic carousel slides placed directly after the header with images, titles, subtitles, descriptions, and direct product links.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingSlideId(null);
                        setSlideForm(initialSlideForm);
                        setIsAddingSlide(true);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <Plus size={18} />
                      <span>Add New Slide</span>
                    </button>
                  </div>

                  {/* SLIDES GRID */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {slidesList.map((slide, index) => {
                      const isActive = slide.active !== false;
                      const linkedProduct = productsList.find(p => p.id === slide.btnActionTarget);

                      return (
                        <div 
                          key={slide.id || index}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '18px',
                            border: isActive ? '1px solid var(--border-subtle)' : '1px dashed var(--border-strong)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            opacity: isActive ? 1 : 0.65,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {/* Slide Media Banner */}
                          <div style={{ position: 'relative', height: '180px', backgroundColor: '#1E1612' }}>
                            <img 
                              src={slide.image} 
                              alt={slide.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"; }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
                            
                            {/* Slide Badge */}
                            {slide.badge && (
                              <span 
                                style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  backgroundColor: slide.badgeColor || 'var(--color-primary)',
                                  color: '#FFFFFF',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '3px 10px',
                                  borderRadius: '999px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                }}
                              >
                                {slide.badge}
                              </span>
                            )}

                            {/* Active Status Badge */}
                            <button
                              onClick={() => handleToggleSlideActive(slide)}
                              style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                backgroundColor: isActive ? '#25D366' : '#757575',
                                color: '#FFFFFF',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '3px 10px',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                              title="Click to toggle visibility on home slider"
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                              <span>{isActive ? 'Active on Home' : 'Hidden'}</span>
                            </button>

                            {/* Position Indicator */}
                            <span 
                              style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '12px',
                                backgroundColor: 'rgba(0,0,0,0.65)',
                                color: '#FFFFFF',
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backdropFilter: 'blur(4px)'
                              }}
                            >
                              Slide #{index + 1}
                            </span>
                          </div>

                          {/* Slide Content */}
                          <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.25rem' }}>
                                {slide.subtitle || 'Handmade with Love ♡'}
                              </div>
                              <h3 style={{ fontSize: '1.18rem', margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, fontFamily: 'var(--font-serif)' }}>
                                {slide.title}
                              </h3>
                              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {slide.description}
                              </p>

                              {/* Button & Product Link Info */}
                              <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '1rem', fontSize: '0.78rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                                  <ShoppingBag size={14} color="var(--color-primary)" />
                                  <span style={{ color: 'var(--text-muted)' }}>Button CTA:</span>
                                  <strong style={{ color: 'var(--text-main)' }}>"{slide.btnText || 'View Product'}"</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <Tag size={13} color="var(--color-honey)" />
                                  <span style={{ color: 'var(--text-muted)' }}>Action:</span>
                                  {slide.btnActionType === 'product' && linkedProduct ? (
                                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                                      Links to: {linkedProduct.title} ({settingsForm.currencySymbol || '₹'}{linkedProduct.price})
                                    </span>
                                  ) : (
                                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                      {slide.btnActionType || 'Product'} {slide.btnActionTarget ? `(${slide.btnActionTarget})` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                              <button
                                onClick={() => handleToggleSlideActive(slide)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: isActive ? 'var(--color-sage)' : 'var(--text-subtle)',
                                  cursor: 'pointer',
                                  padding: 0
                                }}
                              >
                                {isActive ? '✓ Showing in Carousel' : '○ Disabled'}
                              </button>

                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => handleEditSlide(slide)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                                >
                                  <Edit3 size={13} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteSlide(slide.id, slide.title)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ADD / EDIT SLIDE MODAL */}
                  {isAddingSlide && (
                    <div 
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1200,
                        backgroundColor: 'rgba(26, 24, 23, 0.75)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                      }}
                      onClick={() => setIsAddingSlide(false)}
                    >
                      <div 
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '24px',
                          width: '100%',
                          maxWidth: '740px',
                          maxHeight: '90vh',
                          overflowY: 'auto',
                          boxShadow: 'var(--shadow-lg)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Modal Header */}
                        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2', borderRadius: '23px 23px 0 0' }}>
                          <div>
                            <span className="badge badge-terracotta" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                              {editingSlideId ? 'Edit Slide' : 'New Slide'}
                            </span>
                            <h3 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                              {editingSlideId ? `Edit Slide: ${slideForm.title}` : 'Add New Home Image Slide'}
                            </h3>
                          </div>
                          <button
                            onClick={() => setIsAddingSlide(false)}
                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveSlide} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {/* Slide Title */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Slide Main Title *
                            </label>
                            <input 
                              type="text"
                              required
                              value={slideForm.title}
                              onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                              placeholder="e.g. Eternal Blooming Crochet Bouquets"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                            />
                          </div>

                          {/* Subtitle / Tagline */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Subtitle / Tagline *
                            </label>
                            <input 
                              type="text"
                              required
                              value={slideForm.subtitle}
                              onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                              placeholder="e.g. Handmade with Love ♡ • Gaur City 2, Greater Noida West"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Slide Description *
                            </label>
                            <textarea 
                              rows={3}
                              required
                              value={slideForm.description}
                              onChange={e => setSlideForm({ ...slideForm, description: e.target.value })}
                              placeholder="Describe the product materials, craftsmanship, colors, and why customers love it..."
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', resize: 'vertical' }}
                            />
                          </div>

                          {/* Background Image URL & Live Preview */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Slide Image URL *
                            </label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                              <input 
                                type="url"
                                required
                                value={slideForm.image}
                                onChange={e => setSlideForm({ ...slideForm, image: e.target.value })}
                                placeholder="https://images.unsplash.com/photo-..."
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              />
                            </div>
                            {/* Live Thumbnail Preview */}
                            {slideForm.image && (
                              <div style={{ marginTop: '0.75rem', borderRadius: '12px', overflow: 'hidden', height: '140px', position: 'relative', border: '1px solid var(--border-subtle)', backgroundColor: '#1E1612' }}>
                                <img 
                                  src={slideForm.image} 
                                  alt="Slide Preview" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"; }}
                                />
                                <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#FFFFFF', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                                  Live Image Preview
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Badge Text & Color */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Badge Text
                              </label>
                              <input 
                                type="text"
                                value={slideForm.badge}
                                onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                                placeholder="e.g. 🌸 Bestseller Bouquet"
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Badge Color Theme
                              </label>
                              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                                {[
                                  { name: 'Petal Pink', color: '#EE6D88' },
                                  { name: 'Loop Blue', color: '#60A9DF' },
                                  { name: 'Sage Green', color: '#72A179' },
                                  { name: 'Honey Gold', color: '#E29B4A' },
                                  { name: 'Clay Lilac', color: '#99789E' },
                                  { name: 'Mocha Charcoal', color: '#2F2522' }
                                ].map(theme => (
                                  <button
                                    key={theme.name}
                                    type="button"
                                    onClick={() => setSlideForm({ ...slideForm, badgeColor: theme.color })}
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '50%',
                                      backgroundColor: theme.color,
                                      border: slideForm.badgeColor === theme.color ? '3px solid #000' : '2px solid #FFF',
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                    }}
                                    title={theme.name}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Button Text & Target Link */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Primary Button Text *
                              </label>
                              <input 
                                type="text"
                                required
                                value={slideForm.btnText}
                                onChange={e => setSlideForm({ ...slideForm, btnText: e.target.value })}
                                placeholder="e.g. View Forever Rose (₹699)"
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Button Action Type *
                              </label>
                              <select 
                                value={slideForm.btnActionType}
                                onChange={e => setSlideForm({ ...slideForm, btnActionType: e.target.value })}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              >
                                <option value="product">🛍️ Link Directly to a Product</option>
                                <option value="shop">🏪 Open Handcrafted Shop</option>
                                <option value="custom">✨ Open Custom Order Form</option>
                                <option value="packages">🎓 Open Crochet Packages</option>
                                <option value="whatsapp">💬 Direct WhatsApp Chat</option>
                              </select>
                            </div>
                          </div>

                          {/* Select Target Product (When Action Type is 'product') */}
                          {slideForm.btnActionType === 'product' && (
                            <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                                Select Product to Open on Click:
                              </label>
                              <select 
                                value={slideForm.btnActionTarget}
                                onChange={e => {
                                  const targetId = e.target.value;
                                  const prod = productsList.find(p => p.id === targetId);
                                  setSlideForm({ 
                                    ...slideForm, 
                                    btnActionTarget: targetId,
                                    btnText: prod ? `View ${prod.title.split(' ')[0]} (${settingsForm.currencySymbol || '₹'}${prod.price})` : slideForm.btnText
                                  });
                                }}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              >
                                <option value="">-- Choose from Handcrafted Store Inventory --</option>
                                {productsList.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.title} — {settingsForm.currencySymbol || '₹'}{p.price} ({p.category})
                                  </option>
                                ))}
                              </select>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                                When the customer clicks this button, the product quick-order popup will automatically open with photos, prices, and Add to Basket buttons.
                              </div>
                            </div>
                          )}

                          {/* Secondary Button Text & Action */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Secondary Button Text
                              </label>
                              <input 
                                type="text"
                                value={slideForm.btnSecondaryText}
                                onChange={e => setSlideForm({ ...slideForm, btnSecondaryText: e.target.value })}
                                placeholder="e.g. Chat on WhatsApp"
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Secondary Action
                              </label>
                              <select 
                                value={slideForm.btnSecondaryAction}
                                onChange={e => setSlideForm({ ...slideForm, btnSecondaryAction: e.target.value })}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              >
                                <option value="whatsapp">💬 Direct WhatsApp Chat</option>
                                <option value="custom">✨ Custom Commission Order</option>
                                <option value="shop">🏪 Handcrafted Shop</option>
                                <option value="packages">🎓 Classes & Packages</option>
                              </select>
                            </div>
                          </div>

                          {/* Active Visibility Checkbox */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
                            <input 
                              type="checkbox"
                              id="slide-active-checkbox"
                              checked={slideForm.active}
                              onChange={e => setSlideForm({ ...slideForm, active: e.target.checked })}
                              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                            />
                            <label htmlFor="slide-active-checkbox" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Show this slide in Homepage Carousel immediately
                            </label>
                          </div>

                          {/* Submit Actions */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                            <button
                              type="button"
                              onClick={() => setIsAddingSlide(false)}
                              className="btn btn-secondary"
                              style={{ padding: '0.65rem 1.25rem' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              style={{ padding: '0.65rem 1.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                              <Check size={16} />
                              <span>{editingSlideId ? 'Save Slide Updates' : 'Publish to Slider'}</span>
                            </button>
                          </div>

                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 11. FAQ MANAGEMENT MODULE */}
              {crmTab === 'faqs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Header Banner */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: 'linear-gradient(135deg, #FAF7F2 0%, #FFFFFF 100%)',
                    padding: '1.75rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span className="badge badge-terracotta" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <HelpCircle size={12} /> Dynamic Content
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          • Stored in MySQL & JSON Database
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-main)' }}>
                        Frequently Asked Questions (FAQ)
                      </h2>
                      <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        Manage customer questions, studio guidelines, shipping policies, and answers displayed on your live FAQ page.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <a
                        href="/faq"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.1rem', fontSize: '0.85rem' }}
                      >
                        <ExternalLink size={15} /> View Live FAQ Page
                      </a>
                      <button
                        onClick={() => {
                          setEditingFaqId(null);
                          setFaqForm(initialFaqForm);
                          setIsAddingFaq(true);
                        }}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        <Plus size={16} /> Add New FAQ
                      </button>
                    </div>
                  </div>

                  {/* FAQ Metrics Overview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Total Questions
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {faqsList.length}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                        In all categories
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Active & Published
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2E7D32' }}>
                        {faqsList.filter(f => f.active !== false).length}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                        Visible on /faq page
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.78rem', color: '#E65100', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Drafts & Hidden
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#E65100' }}>
                        {faqsList.filter(f => f.active === false).length}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                        Hidden from visitors
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                        Categories
                      </div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {new Set(faqsList.map(f => f.category)).size}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                        Topic filters on page
                      </div>
                    </div>
                  </div>

                  {/* Filters & Search Toolbar */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '1rem', 
                    flexWrap: 'wrap',
                    backgroundColor: '#FFFFFF',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {/* Category Filter Pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                        Category:
                      </span>
                      {['All', ...Array.from(new Set(faqsList.map(f => f.category || 'Orders')))].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFaqCategoryFilter(cat)}
                          className={`btn ${faqCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                          style={{
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.78rem',
                            borderRadius: '20px',
                            fontWeight: faqCategoryFilter === cat ? 700 : 500
                          }}
                        >
                          {cat} {cat !== 'All' ? `(${faqsList.filter(f => f.category === cat).length})` : `(${faqsList.length})`}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div style={{ position: 'relative', minWidth: '260px' }}>
                      <Search 
                        size={15} 
                        style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
                      />
                      <input 
                        type="text"
                        placeholder="Search question or answer..."
                        value={faqSearch}
                        onChange={e => setFaqSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-strong)',
                          fontSize: '0.85rem',
                          backgroundColor: '#FAF7F2'
                        }}
                      />
                      {faqSearch && (
                        <button
                          onClick={() => setFaqSearch('')}
                          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* FAQ Items Grid / List */}
                  {faqsList.filter(f => {
                    const matchCat = faqCategoryFilter === 'All' || f.category === faqCategoryFilter;
                    const matchSearch = !faqSearch || 
                      (f.question && f.question.toLowerCase().includes(faqSearch.toLowerCase())) ||
                      (f.answer && f.answer.toLowerCase().includes(faqSearch.toLowerCase()));
                    return matchCat && matchSearch;
                  }).length === 0 ? (
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '18px', 
                      padding: '3.5rem 2rem', 
                      textAlign: 'center',
                      border: '1px dashed var(--border-strong)'
                    }}>
                      <HelpCircle size={48} color="var(--color-primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>No FAQ Questions Found</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        {faqSearch ? `No questions matched "${faqSearch}". Try clearing your search.` : 'Start adding FAQs to help your customers with orders, shipping, and custom inquiries.'}
                      </p>
                      <button
                        onClick={() => {
                          setEditingFaqId(null);
                          setFaqForm(initialFaqForm);
                          setIsAddingFaq(true);
                        }}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.4rem' }}
                      >
                        <Plus size={16} /> Add First FAQ
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {faqsList
                        .filter(f => {
                          const matchCat = faqCategoryFilter === 'All' || f.category === faqCategoryFilter;
                          const matchSearch = !faqSearch || 
                            (f.question && f.question.toLowerCase().includes(faqSearch.toLowerCase())) ||
                            (f.answer && f.answer.toLowerCase().includes(faqSearch.toLowerCase()));
                          return matchCat && matchSearch;
                        })
                        .map((faq, index) => {
                          const isActive = faq.active !== false;
                          return (
                            <div
                              key={faq.id || index}
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '16px',
                                border: '1px solid var(--border-subtle)',
                                padding: '1.35rem 1.5rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.85rem',
                                opacity: isActive ? 1 : 0.72,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {/* Top Meta Bar */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span 
                                    className="badge" 
                                    style={{ 
                                      backgroundColor: '#FAF7F2', 
                                      color: 'var(--color-primary)', 
                                      border: '1px solid var(--border-subtle)',
                                      fontWeight: 700,
                                      fontSize: '0.72rem',
                                      padding: '0.2rem 0.65rem'
                                    }}
                                  >
                                    📁 {faq.category || 'General'}
                                  </span>

                                  <span 
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      padding: '0.2rem 0.65rem',
                                      borderRadius: '12px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      backgroundColor: isActive ? 'rgba(76, 175, 80, 0.12)' : 'rgba(158, 158, 158, 0.15)',
                                      color: isActive ? '#2E7D32' : '#616161'
                                    }}
                                  >
                                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: isActive ? '#4CAF50' : '#9E9E9E' }} />
                                    {isActive ? 'Live Active' : 'Hidden Draft'}
                                  </span>

                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                                    Order #{faq.sortOrder ?? index + 1}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <button
                                    onClick={() => handleToggleFaqActive(faq)}
                                    className="btn btn-secondary"
                                    style={{ 
                                      padding: '0.35rem 0.75rem', 
                                      fontSize: '0.75rem',
                                      color: isActive ? 'var(--text-muted)' : '#2E7D32'
                                    }}
                                    title={isActive ? 'Hide from public FAQ' : 'Publish to live FAQ'}
                                  >
                                    {isActive ? 'Hide' : 'Publish'}
                                  </button>

                                  <button
                                    onClick={() => handleEditFaq(faq)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>

                                  <button
                                    onClick={() => handleDeleteFaq(faq.id, faq.question)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
                                    title="Delete FAQ Question"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>

                              {/* Question */}
                              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                                {faq.question}
                              </div>

                              {/* Answer */}
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line', backgroundColor: '#FAF7F2', padding: '0.85rem 1rem', borderRadius: '10px' }}>
                                {faq.answer}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* ADD / EDIT FAQ MODAL */}
                  {isAddingFaq && (
                    <div 
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1200,
                        backgroundColor: 'rgba(26, 24, 23, 0.75)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.5rem'
                      }}
                      onClick={() => setIsAddingFaq(false)}
                    >
                      <div 
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '24px',
                          width: '100%',
                          maxWidth: '680px',
                          maxHeight: '90vh',
                          overflowY: 'auto',
                          boxShadow: 'var(--shadow-lg)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Modal Header */}
                        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2', borderRadius: '23px 23px 0 0' }}>
                          <div>
                            <span className="badge badge-terracotta" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                              {editingFaqId ? 'Update FAQ' : 'New Question'}
                            </span>
                            <h3 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-serif)' }}>
                              {editingFaqId ? 'Edit FAQ Question' : 'Add New FAQ Question'}
                            </h3>
                          </div>
                          <button
                            onClick={() => setIsAddingFaq(false)}
                            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                          >
                            ✕
                          </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveFaq} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                          
                          {/* Category and Sort Order */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Category Topic *
                              </label>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select 
                                  value={['Orders', 'Custom', 'Classes', 'Shipping', 'Studio'].includes(faqForm.category) ? faqForm.category : 'Other'}
                                  onChange={e => {
                                    if (e.target.value !== 'Other') {
                                      setFaqForm({ ...faqForm, category: e.target.value });
                                    }
                                  }}
                                  style={{ padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', flex: 1 }}
                                >
                                  <option value="Orders">🛍️ Orders & Purchasing</option>
                                  <option value="Custom">✨ Custom Commissions</option>
                                  <option value="Classes">🎓 Crochet Academy Classes</option>
                                  <option value="Shipping">📦 Shipping & Pan-India Delivery</option>
                                  <option value="Studio">🌸 Studio Care & Materials</option>
                                  <option value="Other">✏️ Custom Category</option>
                                </select>
                              </div>
                              {(!['Orders', 'Custom', 'Classes', 'Shipping', 'Studio'].includes(faqForm.category) || faqForm.category === 'Other') && (
                                <input 
                                  type="text"
                                  placeholder="Type custom category name..."
                                  value={faqForm.category === 'Other' ? '' : faqForm.category}
                                  onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                                  style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.85rem' }}
                                />
                              )}
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                                Display Order (Sort Sequence)
                              </label>
                              <input 
                                type="number"
                                min="0"
                                value={faqForm.sortOrder}
                                onChange={e => setFaqForm({ ...faqForm, sortOrder: parseInt(e.target.value) || 0 })}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem' }}
                              />
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Lower numbers appear first on the page.
                              </div>
                            </div>
                          </div>

                          {/* Question */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Customer Question *
                            </label>
                            <input 
                              type="text"
                              required
                              value={faqForm.question}
                              onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                              placeholder="e.g. How long does a custom crochet commission take to craft?"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.9rem' }}
                            />
                          </div>

                          {/* Answer */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                              Answer & Guidance *
                            </label>
                            <textarea 
                              rows={5}
                              required
                              value={faqForm.answer}
                              onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                              placeholder="Provide a clear, detailed, and warm answer for your customers..."
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-strong)', fontSize: '0.88rem', lineHeight: 1.5, resize: 'vertical' }}
                            />
                          </div>

                          {/* Active Visibility Checkbox */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
                            <input 
                              type="checkbox"
                              id="faq-active-checkbox"
                              checked={faqForm.active}
                              onChange={e => setFaqForm({ ...faqForm, active: e.target.checked })}
                              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                            />
                            <label htmlFor="faq-active-checkbox" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Show this question on live /faq page immediately
                            </label>
                          </div>

                          {/* Submit Actions */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                            <button
                              type="button"
                              onClick={() => setIsAddingFaq(false)}
                              className="btn btn-secondary"
                              style={{ padding: '0.65rem 1.25rem' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingFaq}
                              className="btn btn-primary"
                              style={{ padding: '0.65rem 1.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSavingFaq ? 0.7 : 1 }}
                            >
                              <Check size={16} />
                              <span>{isSavingFaq ? 'Saving...' : (editingFaqId ? 'Update FAQ' : 'Publish FAQ')}</span>
                            </button>
                          </div>

                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* CATEGORY MEDIA & DETAILS PREVIEW MODAL */}
      {selectedPreviewCat && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 1200, 
            backgroundColor: 'rgba(26, 24, 23, 0.75)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '1.5rem' 
          }}
          onClick={() => setSelectedPreviewCat(null)}
        >
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '24px', 
              width: '100%', 
              maxWidth: '680px', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              boxShadow: 'var(--shadow-lg)', 
              border: `3px solid ${selectedPreviewCat.accent || 'var(--color-primary)'}`,
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#FAF7F2', borderRadius: '21px 21px 0 0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>
                    {selectedPreviewCat.badge}
                  </span>
                  <span className="badge badge-sage" style={{ fontSize: '0.65rem' }}>
                    {selectedPreviewCat.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', margin: '0.2rem 0' }}>
                  {selectedPreviewCat.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  {selectedPreviewCat.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPreviewCat(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Category Video Player */}
              {selectedPreviewCat.videoUrl && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Film size={16} color="var(--color-primary)" /> Video Tutorial / Masterclass Introduction
                  </h4>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', border: '1px solid var(--border-subtle)' }}>
                    <iframe
                      src={getEmbedUrl(selectedPreviewCat.videoUrl)}
                      title={selectedPreviewCat.title}
                      style={{ width: '100%', height: '280px', border: 'none', display: 'block' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* 2. Multiple Images Gallery */}
              <div>
                <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ImageIcon size={16} color="var(--color-primary)" /> Image Gallery ({Array.isArray(selectedPreviewCat.images) ? selectedPreviewCat.images.length : 1} Photos)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                  {(Array.isArray(selectedPreviewCat.images) && selectedPreviewCat.images.length > 0 
                    ? selectedPreviewCat.images 
                    : [selectedPreviewCat.coverImage]
                  ).map((img, i) => (
                    <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)', height: '100px' }}>
                      <img src={img} alt={`Gallery view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Formatted Rich Description */}
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '14px', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-primary)', margin: '0 0 0.5rem', fontWeight: 800 }}>
                  Curriculum Description (Formatted Rich Content)
                </h4>
                <div 
                  style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-main)' }}
                  dangerouslySetInnerHTML={{ __html: selectedPreviewCat.description }} 
                />
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2', borderRadius: '0 0 21px 21px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {selectedPreviewCat.projectCount} Classes enrolled in this discipline
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const cat = selectedPreviewCat;
                    setSelectedPreviewCat(null);
                    handleEditCategory(cat);
                  }}
                  className="btn btn-sage"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  <Edit3 size={14} /> Edit Category
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewCat(null)}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
