export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export enum grantTypes {
  ACCESS_TOKEN = 'access',
  REFRESH_TOKEN = 'refresh',
  RESET_PASSWORD = 'resetPassword',
}

export enum userRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
}

export enum CouponType {
  Order = 'Order',
  Product = 'Product',
  FreeShipping = 'FreeShipping',
}

export enum DiscountType {
  Percentage = 'Percentage',
  Fixed = 'Fixed',
  FreeShipping = 'FreeShipping',
}

export enum NotificationType {
  // Order-Related Notifications
  Order = 'Order',
  PromotionalMarketing = 'PromotionalMarketing',
  UserAccount = 'UserAccount',
  ReviewFeedback = 'ReviewFeedback',
  CustomerSupport = 'CustomerSupport',
  WishlistSubscription = 'WishlistSubscription',
}
export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}
