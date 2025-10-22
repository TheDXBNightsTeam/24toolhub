/**
 * Schema Generator for 24ToolHub
 * Generate JSON-LD structured data schemas for better SEO
 */

class SchemaGenerator {
  constructor() {
    this.schemaType = 'website';
    this.schemaData = {};
    this.init();
  }

  init() {
    this.bindEvents();
    this.generateForm();
  }

  bindEvents() {
    // Schema type change
    document.getElementById('schemaType').addEventListener('change', (e) => {
      this.schemaType = e.target.value;
      this.generateForm();
    });

    // Generate schema button
    document.getElementById('generateSchema').addEventListener('click', () => {
      this.generateSchema();
    });

    // Copy schema button
    document.getElementById('copySchema').addEventListener('click', () => {
      this.copySchema();
    });

    // Validate schema button
    document.getElementById('validateSchema').addEventListener('click', () => {
      this.validateSchema();
    });

    // Clear all button
    document.getElementById('clearAll').addEventListener('click', () => {
      this.clearAll();
    });

    // Real-time form updates
    document.addEventListener('input', (e) => {
      if (e.target.closest('#schemaForm')) {
        this.updateSchemaPreview();
      }
    });
  }

  generateForm() {
    const formContainer = document.getElementById('schemaForm');
    const schemaType = this.schemaType;
    
    let formHTML = '';

    switch (schemaType) {
      case 'website':
        formHTML = this.generateWebsiteForm();
        break;
      case 'article':
        formHTML = this.generateArticleForm();
        break;
      case 'product':
        formHTML = this.generateProductForm();
        break;
      case 'organization':
        formHTML = this.generateOrganizationForm();
        break;
      case 'person':
        formHTML = this.generatePersonForm();
        break;
      case 'localbusiness':
        formHTML = this.generateLocalBusinessForm();
        break;
      case 'event':
        formHTML = this.generateEventForm();
        break;
      case 'recipe':
        formHTML = this.generateRecipeForm();
        break;
      case 'review':
        formHTML = this.generateReviewForm();
        break;
      case 'faq':
        formHTML = this.generateFAQForm();
        break;
    }

    formContainer.innerHTML = formHTML;
    this.updateSchemaPreview();
  }

  generateWebsiteForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="websiteName" data-en="Website Name" data-ar="اسم الموقع">Website Name:</label>
          <input type="text" id="websiteName" class="form-input" placeholder="My Website" data-en-placeholder="My Website" data-ar-placeholder="موقعي">
        </div>
        <div class="form-group">
          <label for="websiteUrl" data-en="Website URL" data-ar="رابط الموقع">Website URL:</label>
          <input type="url" id="websiteUrl" class="form-input" placeholder="https://example.com" data-en-placeholder="https://example.com" data-ar-placeholder="https://example.com">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="websiteDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="websiteDescription" class="form-input" rows="3" placeholder="Website description..." data-en-placeholder="Website description..." data-ar-placeholder="وصف الموقع..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="websiteLogo" data-en="Logo URL" data-ar="رابط الشعار">Logo URL:</label>
          <input type="url" id="websiteLogo" class="form-input" placeholder="https://example.com/logo.png" data-en-placeholder="https://example.com/logo.png" data-ar-placeholder="https://example.com/logo.png">
        </div>
        <div class="form-group">
          <label for="websiteLanguage" data-en="Language" data-ar="اللغة">Language:</label>
          <input type="text" id="websiteLanguage" class="form-input" placeholder="en-US" data-en-placeholder="en-US" data-ar-placeholder="ar-SA">
        </div>
      </div>
    `;
  }

  generateArticleForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="articleHeadline" data-en="Headline" data-ar="العنوان">Headline:</label>
          <input type="text" id="articleHeadline" class="form-input" placeholder="Article title" data-en-placeholder="Article title" data-ar-placeholder="عنوان المقال">
        </div>
        <div class="form-group">
          <label for="articleUrl" data-en="Article URL" data-ar="رابط المقال">Article URL:</label>
          <input type="url" id="articleUrl" class="form-input" placeholder="https://example.com/article" data-en-placeholder="https://example.com/article" data-ar-placeholder="https://example.com/article">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="articleDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="articleDescription" class="form-input" rows="3" placeholder="Article description..." data-en-placeholder="Article description..." data-ar-placeholder="وصف المقال..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="articleImage" data-en="Image URL" data-ar="رابط الصورة">Image URL:</label>
          <input type="url" id="articleImage" class="form-input" placeholder="https://example.com/image.jpg" data-en-placeholder="https://example.com/image.jpg" data-ar-placeholder="https://example.com/image.jpg">
        </div>
        <div class="form-group">
          <label for="articleDatePublished" data-en="Date Published" data-ar="تاريخ النشر">Date Published:</label>
          <input type="datetime-local" id="articleDatePublished" class="form-input">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="articleAuthor" data-en="Author Name" data-ar="اسم المؤلف">Author Name:</label>
          <input type="text" id="articleAuthor" class="form-input" placeholder="John Doe" data-en-placeholder="John Doe" data-ar-placeholder="أحمد محمد">
        </div>
        <div class="form-group">
          <label for="articlePublisher" data-en="Publisher" data-ar="الناشر">Publisher:</label>
          <input type="text" id="articlePublisher" class="form-input" placeholder="My Website" data-en-placeholder="My Website" data-ar-placeholder="موقعي">
        </div>
      </div>
    `;
  }

  generateProductForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="productName" data-en="Product Name" data-ar="اسم المنتج">Product Name:</label>
          <input type="text" id="productName" class="form-input" placeholder="Product name" data-en-placeholder="Product name" data-ar-placeholder="اسم المنتج">
        </div>
        <div class="form-group">
          <label for="productSku" data-en="SKU" data-ar="رمز المنتج">SKU:</label>
          <input type="text" id="productSku" class="form-input" placeholder="PROD-001" data-en-placeholder="PROD-001" data-ar-placeholder="PROD-001">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="productDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="productDescription" class="form-input" rows="3" placeholder="Product description..." data-en-placeholder="Product description..." data-ar-placeholder="وصف المنتج..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="productImage" data-en="Image URL" data-ar="رابط الصورة">Image URL:</label>
          <input type="url" id="productImage" class="form-input" placeholder="https://example.com/product.jpg" data-en-placeholder="https://example.com/product.jpg" data-ar-placeholder="https://example.com/product.jpg">
        </div>
        <div class="form-group">
          <label for="productBrand" data-en="Brand" data-ar="العلامة التجارية">Brand:</label>
          <input type="text" id="productBrand" class="form-input" placeholder="Brand name" data-en-placeholder="Brand name" data-ar-placeholder="اسم العلامة التجارية">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="productPrice" data-en="Price" data-ar="السعر">Price:</label>
          <input type="number" id="productPrice" class="form-input" placeholder="99.99" step="0.01" data-en-placeholder="99.99" data-ar-placeholder="99.99">
        </div>
        <div class="form-group">
          <label for="productCurrency" data-en="Currency" data-ar="العملة">Currency:</label>
          <select id="productCurrency" class="form-select">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="SAR">SAR</option>
            <option value="AED">AED</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="productAvailability" data-en="Availability" data-ar="التوفر">Availability:</label>
          <select id="productAvailability" class="form-select">
            <option value="InStock" data-en="In Stock" data-ar="متوفر">In Stock</option>
            <option value="OutOfStock" data-en="Out of Stock" data-ar="غير متوفر">Out of Stock</option>
            <option value="PreOrder" data-en="Pre-order" data-ar="طلب مسبق">Pre-order</option>
          </select>
        </div>
        <div class="form-group">
          <label for="productCondition" data-en="Condition" data-ar="الحالة">Condition:</label>
          <select id="productCondition" class="form-select">
            <option value="NewCondition" data-en="New" data-ar="جديد">New</option>
            <option value="UsedCondition" data-en="Used" data-ar="مستعمل">Used</option>
            <option value="RefurbishedCondition" data-en="Refurbished" data-ar="مجدّد">Refurbished</option>
          </select>
        </div>
      </div>
    `;
  }

  generateOrganizationForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="orgName" data-en="Organization Name" data-ar="اسم المنظمة">Organization Name:</label>
          <input type="text" id="orgName" class="form-input" placeholder="Company Name" data-en-placeholder="Company Name" data-ar-placeholder="اسم الشركة">
        </div>
        <div class="form-group">
          <label for="orgUrl" data-en="Website URL" data-ar="رابط الموقع">Website URL:</label>
          <input type="url" id="orgUrl" class="form-input" placeholder="https://example.com" data-en-placeholder="https://example.com" data-ar-placeholder="https://example.com">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="orgDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="orgDescription" class="form-input" rows="3" placeholder="Organization description..." data-en-placeholder="Organization description..." data-ar-placeholder="وصف المنظمة..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="orgLogo" data-en="Logo URL" data-ar="رابط الشعار">Logo URL:</label>
          <input type="url" id="orgLogo" class="form-input" placeholder="https://example.com/logo.png" data-en-placeholder="https://example.com/logo.png" data-ar-placeholder="https://example.com/logo.png">
        </div>
        <div class="form-group">
          <label for="orgPhone" data-en="Phone" data-ar="الهاتف">Phone:</label>
          <input type="tel" id="orgPhone" class="form-input" placeholder="+1-555-123-4567" data-en-placeholder="+1-555-123-4567" data-ar-placeholder="+966-50-123-4567">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="orgEmail" data-en="Email" data-ar="البريد الإلكتروني">Email:</label>
          <input type="email" id="orgEmail" class="form-input" placeholder="contact@example.com" data-en-placeholder="contact@example.com" data-ar-placeholder="contact@example.com">
        </div>
        <div class="form-group">
          <label for="orgAddress" data-en="Address" data-ar="العنوان">Address:</label>
          <input type="text" id="orgAddress" class="form-input" placeholder="123 Main St, City, Country" data-en-placeholder="123 Main St, City, Country" data-ar-placeholder="123 شارع الرئيسي، المدينة، البلد">
        </div>
      </div>
    `;
  }

  generatePersonForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="personName" data-en="Full Name" data-ar="الاسم الكامل">Full Name:</label>
          <input type="text" id="personName" class="form-input" placeholder="John Doe" data-en-placeholder="John Doe" data-ar-placeholder="أحمد محمد">
        </div>
        <div class="form-group">
          <label for="personJobTitle" data-en="Job Title" data-ar="المسمى الوظيفي">Job Title:</label>
          <input type="text" id="personJobTitle" class="form-input" placeholder="Software Engineer" data-en-placeholder="Software Engineer" data-ar-placeholder="مهندس برمجيات">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="personDescription" class="form-input" rows="3" placeholder="Person description..." data-en-placeholder="Person description..." data-ar-placeholder="وصف الشخص..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personImage" data-en="Image URL" data-ar="رابط الصورة">Image URL:</label>
          <input type="url" id="personImage" class="form-input" placeholder="https://example.com/photo.jpg" data-en-placeholder="https://example.com/photo.jpg" data-ar-placeholder="https://example.com/photo.jpg">
        </div>
        <div class="form-group">
          <label for="personWebsite" data-en="Website URL" data-ar="رابط الموقع">Website URL:</label>
          <input type="url" id="personWebsite" class="form-input" placeholder="https://johndoe.com" data-en-placeholder="https://johndoe.com" data-ar-placeholder="https://ahmed.com">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personEmail" data-en="Email" data-ar="البريد الإلكتروني">Email:</label>
          <input type="email" id="personEmail" class="form-input" placeholder="john@example.com" data-en-placeholder="john@example.com" data-ar-placeholder="ahmed@example.com">
        </div>
        <div class="form-group">
          <label for="personPhone" data-en="Phone" data-ar="الهاتف">Phone:</label>
          <input type="tel" id="personPhone" class="form-input" placeholder="+1-555-123-4567" data-en-placeholder="+1-555-123-4567" data-ar-placeholder="+966-50-123-4567">
        </div>
      </div>
    `;
  }

  generateLocalBusinessForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="businessName" data-en="Business Name" data-ar="اسم العمل">Business Name:</label>
          <input type="text" id="businessName" class="form-input" placeholder="My Business" data-en-placeholder="My Business" data-ar-placeholder="عملي">
        </div>
        <div class="form-group">
          <label for="businessType" data-en="Business Type" data-ar="نوع العمل">Business Type:</label>
          <select id="businessType" class="form-select">
            <option value="Restaurant" data-en="Restaurant" data-ar="مطعم">Restaurant</option>
            <option value="Store" data-en="Store" data-ar="متجر">Store</option>
            <option value="Service" data-en="Service" data-ar="خدمة">Service</option>
            <option value="Hotel" data-en="Hotel" data-ar="فندق">Hotel</option>
            <option value="Bank" data-en="Bank" data-ar="بنك">Bank</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="businessDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="businessDescription" class="form-input" rows="3" placeholder="Business description..." data-en-placeholder="Business description..." data-ar-placeholder="وصف العمل..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="businessAddress" data-en="Address" data-ar="العنوان">Address:</label>
          <input type="text" id="businessAddress" class="form-input" placeholder="123 Main St, City, Country" data-en-placeholder="123 Main St, City, Country" data-ar-placeholder="123 شارع الرئيسي، المدينة، البلد">
        </div>
        <div class="form-group">
          <label for="businessPhone" data-en="Phone" data-ar="الهاتف">Phone:</label>
          <input type="tel" id="businessPhone" class="form-input" placeholder="+1-555-123-4567" data-en-placeholder="+1-555-123-4567" data-ar-placeholder="+966-50-123-4567">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="businessEmail" data-en="Email" data-ar="البريد الإلكتروني">Email:</label>
          <input type="email" id="businessEmail" class="form-input" placeholder="contact@business.com" data-en-placeholder="contact@business.com" data-ar-placeholder="contact@business.com">
        </div>
        <div class="form-group">
          <label for="businessWebsite" data-en="Website URL" data-ar="رابط الموقع">Website URL:</label>
          <input type="url" id="businessWebsite" class="form-input" placeholder="https://business.com" data-en-placeholder="https://business.com" data-ar-placeholder="https://business.com">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="businessHours" data-en="Opening Hours" data-ar="ساعات العمل">Opening Hours:</label>
          <input type="text" id="businessHours" class="form-input" placeholder="Mo-Fr 09:00-17:00" data-en-placeholder="Mo-Fr 09:00-17:00" data-ar-placeholder="السبت-الأربعاء 09:00-17:00">
        </div>
        <div class="form-group">
          <label for="businessPriceRange" data-en="Price Range" data-ar="نطاق الأسعار">Price Range:</label>
          <select id="businessPriceRange" class="form-select">
            <option value="$" data-en="$ (Inexpensive)" data-ar="$ (رخيص)">$ (Inexpensive)</option>
            <option value="$$" data-en="$$ (Moderate)" data-ar="$$ (متوسط)">$$ (Moderate)</option>
            <option value="$$$" data-en="$$$ (Expensive)" data-ar="$$$ (غالي)">$$$ (Expensive)</option>
            <option value="$$$$" data-en="$$$$ (Very Expensive)" data-ar="$$$$ (غالي جداً)">$$$$ (Very Expensive)</option>
          </select>
        </div>
      </div>
    `;
  }

  generateEventForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="eventName" data-en="Event Name" data-ar="اسم الحدث">Event Name:</label>
          <input type="text" id="eventName" class="form-input" placeholder="Event Title" data-en-placeholder="Event Title" data-ar-placeholder="عنوان الحدث">
        </div>
        <div class="form-group">
          <label for="eventType" data-en="Event Type" data-ar="نوع الحدث">Event Type:</label>
          <select id="eventType" class="form-select">
            <option value="BusinessEvent" data-en="Business Event" data-ar="حدث تجاري">Business Event</option>
            <option value="ChildrensEvent" data-en="Children's Event" data-ar="حدث للأطفال">Children's Event</option>
            <option value="ComedyEvent" data-en="Comedy Event" data-ar="حدث كوميدي">Comedy Event</option>
            <option value="DanceEvent" data-en="Dance Event" data-ar="حدث رقص">Dance Event</option>
            <option value="EducationEvent" data-en="Education Event" data-ar="حدث تعليمي">Education Event</option>
            <option value="Festival" data-en="Festival" data-ar="مهرجان">Festival</option>
            <option value="MusicEvent" data-en="Music Event" data-ar="حدث موسيقي">Music Event</option>
            <option value="SportsEvent" data-en="Sports Event" data-ar="حدث رياضي">Sports Event</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="eventDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="eventDescription" class="form-input" rows="3" placeholder="Event description..." data-en-placeholder="Event description..." data-ar-placeholder="وصف الحدث..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="eventStartDate" data-en="Start Date" data-ar="تاريخ البداية">Start Date:</label>
          <input type="datetime-local" id="eventStartDate" class="form-input">
        </div>
        <div class="form-group">
          <label for="eventEndDate" data-en="End Date" data-ar="تاريخ النهاية">End Date:</label>
          <input type="datetime-local" id="eventEndDate" class="form-input">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="eventLocation" data-en="Location" data-ar="الموقع">Location:</label>
          <input type="text" id="eventLocation" class="form-input" placeholder="Event venue" data-en-placeholder="Event venue" data-ar-placeholder="مكان الحدث">
        </div>
        <div class="form-group">
          <label for="eventUrl" data-en="Event URL" data-ar="رابط الحدث">Event URL:</label>
          <input type="url" id="eventUrl" class="form-input" placeholder="https://example.com/event" data-en-placeholder="https://example.com/event" data-ar-placeholder="https://example.com/event">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="eventImage" data-en="Image URL" data-ar="رابط الصورة">Image URL:</label>
          <input type="url" id="eventImage" class="form-input" placeholder="https://example.com/event.jpg" data-en-placeholder="https://example.com/event.jpg" data-ar-placeholder="https://example.com/event.jpg">
        </div>
        <div class="form-group">
          <label for="eventPrice" data-en="Price" data-ar="السعر">Price:</label>
          <input type="number" id="eventPrice" class="form-input" placeholder="25.00" step="0.01" data-en-placeholder="25.00" data-ar-placeholder="25.00">
        </div>
      </div>
    `;
  }

  generateRecipeForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="recipeName" data-en="Recipe Name" data-ar="اسم الوصفة">Recipe Name:</label>
          <input type="text" id="recipeName" class="form-input" placeholder="Delicious Recipe" data-en-placeholder="Delicious Recipe" data-ar-placeholder="وصفة لذيذة">
        </div>
        <div class="form-group">
          <label for="recipeAuthor" data-en="Author" data-ar="المؤلف">Author:</label>
          <input type="text" id="recipeAuthor" class="form-input" placeholder="Chef Name" data-en-placeholder="Chef Name" data-ar-placeholder="اسم الشيف">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="recipeDescription" class="form-input" rows="3" placeholder="Recipe description..." data-en-placeholder="Recipe description..." data-ar-placeholder="وصف الوصفة..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeImage" data-en="Image URL" data-ar="رابط الصورة">Image URL:</label>
          <input type="url" id="recipeImage" class="form-input" placeholder="https://example.com/recipe.jpg" data-en-placeholder="https://example.com/recipe.jpg" data-ar-placeholder="https://example.com/recipe.jpg">
        </div>
        <div class="form-group">
          <label for="recipePrepTime" data-en="Prep Time" data-ar="وقت التحضير">Prep Time:</label>
          <input type="text" id="recipePrepTime" class="form-input" placeholder="PT15M" data-en-placeholder="PT15M" data-ar-placeholder="PT15M">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeCookTime" data-en="Cook Time" data-ar="وقت الطبخ">Cook Time:</label>
          <input type="text" id="recipeCookTime" class="form-input" placeholder="PT30M" data-en-placeholder="PT30M" data-ar-placeholder="PT30M">
        </div>
        <div class="form-group">
          <label for="recipeTotalTime" data-en="Total Time" data-ar="الوقت الإجمالي">Total Time:</label>
          <input type="text" id="recipeTotalTime" class="form-input" placeholder="PT45M" data-en-placeholder="PT45M" data-ar-placeholder="PT45M">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeServings" data-en="Servings" data-ar="عدد الحصص">Servings:</label>
          <input type="number" id="recipeServings" class="form-input" placeholder="4" data-en-placeholder="4" data-ar-placeholder="4">
        </div>
        <div class="form-group">
          <label for="recipeCalories" data-en="Calories" data-ar="السعرات الحرارية">Calories:</label>
          <input type="number" id="recipeCalories" class="form-input" placeholder="350" data-en-placeholder="350" data-ar-placeholder="350">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeIngredients" data-en="Ingredients" data-ar="المكونات">Ingredients:</label>
          <textarea id="recipeIngredients" class="form-input" rows="4" placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar" data-en-placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar" data-ar-placeholder="1 كوب دقيق&#10;2 بيضة&#10;1/2 كوب سكر"></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="recipeInstructions" data-en="Instructions" data-ar="التعليمات">Instructions:</label>
          <textarea id="recipeInstructions" class="form-input" rows="4" placeholder="1. Mix ingredients&#10;2. Bake for 30 minutes&#10;3. Serve hot" data-en-placeholder="1. Mix ingredients&#10;2. Bake for 30 minutes&#10;3. Serve hot" data-ar-placeholder="1. اخلط المكونات&#10;2. اخبز لمدة 30 دقيقة&#10;3. قدم ساخناً"></textarea>
        </div>
      </div>
    `;
  }

  generateReviewForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="reviewItem" data-en="Item Being Reviewed" data-ar="العنصر المراجع">Item Being Reviewed:</label>
          <input type="text" id="reviewItem" class="form-input" placeholder="Product or Service Name" data-en-placeholder="Product or Service Name" data-ar-placeholder="اسم المنتج أو الخدمة">
        </div>
        <div class="form-group">
          <label for="reviewAuthor" data-en="Reviewer Name" data-ar="اسم المراجع">Reviewer Name:</label>
          <input type="text" id="reviewAuthor" class="form-input" placeholder="John Doe" data-en-placeholder="John Doe" data-ar-placeholder="أحمد محمد">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="reviewRating" data-en="Rating" data-ar="التقييم">Rating:</label>
          <select id="reviewRating" class="form-select">
            <option value="1" data-en="1 Star" data-ar="نجمة واحدة">1 Star</option>
            <option value="2" data-en="2 Stars" data-ar="نجمتان">2 Stars</option>
            <option value="3" data-en="3 Stars" data-ar="3 نجوم">3 Stars</option>
            <option value="4" data-en="4 Stars" data-ar="4 نجوم">4 Stars</option>
            <option value="5" data-en="5 Stars" data-ar="5 نجوم">5 Stars</option>
          </select>
        </div>
        <div class="form-group">
          <label for="reviewDate" data-en="Review Date" data-ar="تاريخ المراجعة">Review Date:</label>
          <input type="date" id="reviewDate" class="form-input">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="reviewText" data-en="Review Text" data-ar="نص المراجعة">Review Text:</label>
          <textarea id="reviewText" class="form-input" rows="4" placeholder="Write your review here..." data-en-placeholder="Write your review here..." data-ar-placeholder="اكتب مراجعتك هنا..."></textarea>
        </div>
      </div>
    `;
  }

  generateFAQForm() {
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="faqTitle" data-en="FAQ Title" data-ar="عنوان الأسئلة الشائعة">FAQ Title:</label>
          <input type="text" id="faqTitle" class="form-input" placeholder="Frequently Asked Questions" data-en-placeholder="Frequently Asked Questions" data-ar-placeholder="الأسئلة الشائعة">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="faqDescription" data-en="Description" data-ar="الوصف">Description:</label>
          <textarea id="faqDescription" class="form-input" rows="3" placeholder="FAQ section description..." data-en-placeholder="FAQ section description..." data-ar-placeholder="وصف قسم الأسئلة الشائعة..."></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="faqQuestions" data-en="Questions & Answers" data-ar="الأسئلة والأجوبة">Questions & Answers:</label>
          <textarea id="faqQuestions" class="form-input" rows="8" placeholder="Q: What is your return policy?&#10;A: We offer 30-day returns.&#10;&#10;Q: How long does shipping take?&#10;A: Shipping takes 3-5 business days." data-en-placeholder="Q: What is your return policy?&#10;A: We offer 30-day returns.&#10;&#10;Q: How long does shipping take?&#10;A: Shipping takes 3-5 business days." data-ar-placeholder="س: ما هي سياسة الإرجاع؟&#10;ج: نقدم إرجاع لمدة 30 يوماً.&#10;&#10;س: كم يستغرق الشحن؟&#10;ج: الشحن يستغرق 3-5 أيام عمل."></textarea>
        </div>
      </div>
    `;
  }

  generateSchema() {
    const schemaData = this.collectFormData();
    const schema = this.createSchemaObject(schemaData);
    
    const output = document.getElementById('schemaOutput');
    output.value = JSON.stringify(schema, null, 2);
    
    this.updateStatistics(schema);
    this.updatePreview(schema);
    
    if (window.PopupUtils) {
      PopupUtils.success('Schema generated successfully!', 'Success');
    }
  }

  collectFormData() {
    const formData = {};
    const form = document.getElementById('schemaForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (input.value.trim()) {
        formData[input.id] = input.value.trim();
      }
    });
    
    return formData;
  }

  createSchemaObject(data) {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": this.getSchemaType()
    };

    switch (this.schemaType) {
      case 'website':
        return this.createWebsiteSchema(baseSchema, data);
      case 'article':
        return this.createArticleSchema(baseSchema, data);
      case 'product':
        return this.createProductSchema(baseSchema, data);
      case 'organization':
        return this.createOrganizationSchema(baseSchema, data);
      case 'person':
        return this.createPersonSchema(baseSchema, data);
      case 'localbusiness':
        return this.createLocalBusinessSchema(baseSchema, data);
      case 'event':
        return this.createEventSchema(baseSchema, data);
      case 'recipe':
        return this.createRecipeSchema(baseSchema, data);
      case 'review':
        return this.createReviewSchema(baseSchema, data);
      case 'faq':
        return this.createFAQSchema(baseSchema, data);
      default:
        return baseSchema;
    }
  }

  getSchemaType() {
    const typeMap = {
      'website': 'WebSite',
      'article': 'Article',
      'product': 'Product',
      'organization': 'Organization',
      'person': 'Person',
      'localbusiness': 'LocalBusiness',
      'event': 'Event',
      'recipe': 'Recipe',
      'review': 'Review',
      'faq': 'FAQPage'
    };
    return typeMap[this.schemaType] || 'WebSite';
  }

  createWebsiteSchema(baseSchema, data) {
    if (data.websiteName) baseSchema.name = data.websiteName;
    if (data.websiteUrl) baseSchema.url = data.websiteUrl;
    if (data.websiteDescription) baseSchema.description = data.websiteDescription;
    if (data.websiteLogo) baseSchema.logo = data.websiteLogo;
    if (data.websiteLanguage) baseSchema.inLanguage = data.websiteLanguage;
    
    return baseSchema;
  }

  createArticleSchema(baseSchema, data) {
    if (data.articleHeadline) baseSchema.headline = data.articleHeadline;
    if (data.articleUrl) baseSchema.url = data.articleUrl;
    if (data.articleDescription) baseSchema.description = data.articleDescription;
    if (data.articleImage) baseSchema.image = data.articleImage;
    if (data.articleDatePublished) baseSchema.datePublished = new Date(data.articleDatePublished).toISOString();
    if (data.articleAuthor) baseSchema.author = { "@type": "Person", "name": data.articleAuthor };
    if (data.articlePublisher) baseSchema.publisher = { "@type": "Organization", "name": data.articlePublisher };
    
    return baseSchema;
  }

  createProductSchema(baseSchema, data) {
    if (data.productName) baseSchema.name = data.productName;
    if (data.productSku) baseSchema.sku = data.productSku;
    if (data.productDescription) baseSchema.description = data.productDescription;
    if (data.productImage) baseSchema.image = data.productImage;
    if (data.productBrand) baseSchema.brand = { "@type": "Brand", "name": data.productBrand };
    if (data.productPrice) {
      baseSchema.offers = {
        "@type": "Offer",
        "price": data.productPrice,
        "priceCurrency": data.productCurrency || "USD",
        "availability": data.productAvailability || "InStock",
        "itemCondition": data.productCondition || "NewCondition"
      };
    }
    
    return baseSchema;
  }

  createOrganizationSchema(baseSchema, data) {
    if (data.orgName) baseSchema.name = data.orgName;
    if (data.orgUrl) baseSchema.url = data.orgUrl;
    if (data.orgDescription) baseSchema.description = data.orgDescription;
    if (data.orgLogo) baseSchema.logo = data.orgLogo;
    if (data.orgPhone) baseSchema.telephone = data.orgPhone;
    if (data.orgEmail) baseSchema.email = data.orgEmail;
    if (data.orgAddress) {
      baseSchema.address = {
        "@type": "PostalAddress",
        "streetAddress": data.orgAddress
      };
    }
    
    return baseSchema;
  }

  createPersonSchema(baseSchema, data) {
    if (data.personName) baseSchema.name = data.personName;
    if (data.personJobTitle) baseSchema.jobTitle = data.personJobTitle;
    if (data.personDescription) baseSchema.description = data.personDescription;
    if (data.personImage) baseSchema.image = data.personImage;
    if (data.personWebsite) baseSchema.url = data.personWebsite;
    if (data.personEmail) baseSchema.email = data.personEmail;
    if (data.personPhone) baseSchema.telephone = data.personPhone;
    
    return baseSchema;
  }

  createLocalBusinessSchema(baseSchema, data) {
    if (data.businessName) baseSchema.name = data.businessName;
    if (data.businessDescription) baseSchema.description = data.businessDescription;
    if (data.businessAddress) {
      baseSchema.address = {
        "@type": "PostalAddress",
        "streetAddress": data.businessAddress
      };
    }
    if (data.businessPhone) baseSchema.telephone = data.businessPhone;
    if (data.businessEmail) baseSchema.email = data.businessEmail;
    if (data.businessWebsite) baseSchema.url = data.businessWebsite;
    if (data.businessHours) baseSchema.openingHours = data.businessHours;
    if (data.businessPriceRange) baseSchema.priceRange = data.businessPriceRange;
    
    return baseSchema;
  }

  createEventSchema(baseSchema, data) {
    if (data.eventName) baseSchema.name = data.eventName;
    if (data.eventDescription) baseSchema.description = data.eventDescription;
    if (data.eventStartDate) baseSchema.startDate = new Date(data.eventStartDate).toISOString();
    if (data.eventEndDate) baseSchema.endDate = new Date(data.eventEndDate).toISOString();
    if (data.eventLocation) {
      baseSchema.location = {
        "@type": "Place",
        "name": data.eventLocation
      };
    }
    if (data.eventUrl) baseSchema.url = data.eventUrl;
    if (data.eventImage) baseSchema.image = data.eventImage;
    if (data.eventPrice) {
      baseSchema.offers = {
        "@type": "Offer",
        "price": data.eventPrice,
        "priceCurrency": "USD"
      };
    }
    
    return baseSchema;
  }

  createRecipeSchema(baseSchema, data) {
    if (data.recipeName) baseSchema.name = data.recipeName;
    if (data.recipeAuthor) baseSchema.author = { "@type": "Person", "name": data.recipeAuthor };
    if (data.recipeDescription) baseSchema.description = data.recipeDescription;
    if (data.recipeImage) baseSchema.image = data.recipeImage;
    if (data.recipePrepTime) baseSchema.prepTime = data.recipePrepTime;
    if (data.recipeCookTime) baseSchema.cookTime = data.recipeCookTime;
    if (data.recipeTotalTime) baseSchema.totalTime = data.recipeTotalTime;
    if (data.recipeServings) baseSchema.recipeYield = data.recipeServings;
    if (data.recipeCalories) baseSchema.nutrition = { "@type": "NutritionInformation", "calories": data.recipeCalories };
    
    if (data.recipeIngredients) {
      baseSchema.recipeIngredient = data.recipeIngredients.split('\n').filter(ingredient => ingredient.trim());
    }
    
    if (data.recipeInstructions) {
      baseSchema.recipeInstructions = data.recipeInstructions.split('\n').filter(instruction => instruction.trim()).map(instruction => ({
        "@type": "HowToStep",
        "text": instruction.trim()
      }));
    }
    
    return baseSchema;
  }

  createReviewSchema(baseSchema, data) {
    if (data.reviewItem) baseSchema.itemReviewed = { "@type": "Thing", "name": data.reviewItem };
    if (data.reviewAuthor) baseSchema.author = { "@type": "Person", "name": data.reviewAuthor };
    if (data.reviewRating) {
      baseSchema.reviewRating = {
        "@type": "Rating",
        "ratingValue": data.reviewRating,
        "bestRating": "5"
      };
    }
    if (data.reviewDate) baseSchema.datePublished = new Date(data.reviewDate).toISOString();
    if (data.reviewText) baseSchema.reviewBody = data.reviewText;
    
    return baseSchema;
  }

  createFAQSchema(baseSchema, data) {
    if (data.faqTitle) baseSchema.name = data.faqTitle;
    if (data.faqDescription) baseSchema.description = data.faqDescription;
    
    if (data.faqQuestions) {
      const qaPairs = data.faqQuestions.split('\n\n');
      baseSchema.mainEntity = qaPairs.map(pair => {
        const lines = pair.split('\n');
        const question = lines.find(line => line.startsWith('Q:') || line.startsWith('س:'));
        const answer = lines.find(line => line.startsWith('A:') || line.startsWith('ج:'));
        
        if (question && answer) {
          return {
            "@type": "Question",
            "name": question.replace(/^[Qس]:\s*/, ''),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer.replace(/^[Aج]:\s*/, '')
            }
          };
        }
        return null;
      }).filter(item => item !== null);
    }
    
    return baseSchema;
  }

  updateStatistics(schema) {
    document.getElementById('statType').textContent = schema['@type'];
    document.getElementById('statProperties').textContent = Object.keys(schema).length - 2; // Exclude @context and @type
    document.getElementById('statSize').textContent = JSON.stringify(schema).length + ' bytes';
    document.getElementById('statValidation').textContent = 'Valid';
  }

  updatePreview(schema) {
    const preview = document.getElementById('schemaPreview');
    preview.innerHTML = `
      <div class="schema-preview-content">
        <h4>Schema Preview:</h4>
        <div class="schema-info">
          <p><strong>Type:</strong> ${schema['@type']}</p>
          <p><strong>Context:</strong> ${schema['@context']}</p>
          ${schema.name ? `<p><strong>Name:</strong> ${schema.name}</p>` : ''}
          ${schema.description ? `<p><strong>Description:</strong> ${schema.description}</p>` : ''}
          ${schema.url ? `<p><strong>URL:</strong> <a href="${schema.url}" target="_blank">${schema.url}</a></p>` : ''}
        </div>
      </div>
    `;
  }

  updateSchemaPreview() {
    // Real-time preview update
    const formData = this.collectFormData();
    if (Object.keys(formData).length > 0) {
      const schema = this.createSchemaObject(formData);
      this.updatePreview(schema);
    }
  }

  copySchema() {
    const output = document.getElementById('schemaOutput');
    if (output.value.trim()) {
      output.select();
      document.execCommand('copy');
      
      if (window.PopupUtils) {
        PopupUtils.success('Schema copied to clipboard!', 'Success');
      }
    } else {
      if (window.PopupUtils) {
        PopupUtils.warning('Please generate a schema first!', 'Warning');
      }
    }
  }

  validateSchema() {
    const output = document.getElementById('schemaOutput');
    if (!output.value.trim()) {
      if (window.PopupUtils) {
        PopupUtils.warning('Please generate a schema first!', 'Warning');
      }
      return;
    }

    try {
      const schema = JSON.parse(output.value);
      
      // Basic validation
      if (!schema['@context'] || !schema['@type']) {
        throw new Error('Missing required @context or @type');
      }

      if (window.PopupUtils) {
        PopupUtils.success('Schema is valid!', 'Validation Success');
      }
      
      document.getElementById('statValidation').textContent = 'Valid';
    } catch (error) {
      if (window.PopupUtils) {
        PopupUtils.error('Schema validation failed: ' + error.message, 'Validation Error');
      }
      
      document.getElementById('statValidation').textContent = 'Invalid';
    }
  }

  clearAll() {
    if (window.PopupUtils) {
      PopupUtils.confirm('Are you sure you want to clear all data?', 'Confirm Clear', () => {
        // Clear form
        const form = document.getElementById('schemaForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          input.value = '';
        });

        // Clear output
        document.getElementById('schemaOutput').value = '';

        // Clear preview
        document.getElementById('schemaPreview').innerHTML = '<p>Schema preview will appear here...</p>';

        // Clear statistics
        document.getElementById('statType').textContent = '-';
        document.getElementById('statProperties').textContent = '0';
        document.getElementById('statSize').textContent = '0 bytes';
        document.getElementById('statValidation').textContent = '-';

        PopupUtils.success('All data cleared!', 'Success');
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SchemaGenerator();
  initializeTabs();
  initializeFAQ();
});

// Initialize tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current FAQ item
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
            }
        });
    });
}
