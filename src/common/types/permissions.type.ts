export enum PermissionType {
  ALL = '*',

  READ_PRODUCT = 'read:product',
  WRITE_PRODUCT = 'write:product',
  DELETE_PRODUCT = 'delete:product',

  READ_USER = 'read:user',
  WRITE_USER = 'write:user',
  DELETE_USER = 'delete:user',

  READ_ROLE = 'read:role',
  WRITE_ROLE = 'write:role',
  DELETE_ROLE = 'delete:role',

  READ_CLIENT = 'read:client',
  WRITE_CLIENT = 'write:client',
  DELETE_CLIENT = 'delete:client',
  ACTIVATE_CLIENT = 'activate:client',

  READ_ORDER = 'read:order',
  CREATE_ORDER = 'create:order',
  DELETE_ORDER = 'delete:order',
  UPDATE_ORDER = 'update:order',

  READ_DOCUMENT = 'read:document',
  CREATE_DOCUMENT = 'create:document',
  DELETE_DOCUMENT = 'delete:document',
  UPDATE_DOCUMENT = 'update:document',
  VALIDATE_DOCUMENT = 'validate:document',

  READ_CONFIG = 'read:config',
  WRITE_CONFIG = 'write:config',
  DELETE_CONFIG = 'delete:config',

  READ_PRICE_OFFER = 'read:price_offer',
  WRITE_PRICE_OFFER = 'write:price_offer',

  READ_PAYMENT = 'read:payment',
  CREATE_PAYMENT = 'create:payment',
  UPDATE_PAYMENT = 'update:payment',
  DELETE_PAYMENT = 'delete:payment',

  READ_MARINE_TRAFFIC = 'read:marine_traffic',
}
