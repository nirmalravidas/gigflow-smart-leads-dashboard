export enum LeadSortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
}

export enum LeadPopulateField {
  CREATED_BY = 'createdBy',
  ASSIGNED_TO = 'assignedTo',
}

export enum LeadEvent {
  CREATED = 'lead.created',
  UPDATED = 'lead.updated',
  DELETED = 'lead.deleted',
  EXPORTED = 'lead.exported',
}
