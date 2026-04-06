export const registerFormControls = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "laptop", label: "Laptop" },
      { id: "monitor", label: "Monitor" },
      { id: "phone", label: "Phone" },
      { id: "camera", label: "Camera" },
      { id: "headphone", label: "Headphone" },
    ],
    placeholder: "Select product category",
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Featured Product",
    name: "featured",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
    placeholder: "Is this a featured product?",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "laptop",
    label: "Laptop",
    path: "/shop/listing",
  },
  {
    id: "monitor",
    label: "Monitor",
    path: "/shop/listing",
  },
  {
    id: "phone",
    label: "Phone",
    path: "/shop/listing",
  },
  {
    id: "camera",
    label: "Camera",
    path: "/shop/listing",
  },
  {
    id: "headphone",
    label: "Headphone",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const filterOptions = {
  category: [
    {
      id: "laptop",
      label: "Laptop",
    },
    {
      id: "monitor",
      label: "Monitor",
    },
    {
      id: "phone",
      label: "Phone",
    },
    {
      id: "camera",
      label: "Camera",
    },
    {
      id: "headphone",
      label: "Headphone",
    },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Postal Code",
    name: "postalCode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your postal code",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone",
  },
];

export const profileFormControls = [
  {
    label: "Name",
    name: "name",
    componentType: "text",
    type: "text",
  },
  {
    label: "Email",
    name: "email",
    componentType: "input",
    type: "email",
  },
];

export const updatePasswordFormControls = [
  {
    label: "Old Password",
    name: "oldPassword",
    componentType: "input",
    type: "password",
    placeholder: "Enter Old Password",
  },
  {
    label: "New Password",
    name: "newPassword",
    componentType: "input",
    type: "password",
    placeholder: "Enter New Password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    componentType: "input",
    type: "password",
    placeholder: "Enter Confirm Password",
  },
];
