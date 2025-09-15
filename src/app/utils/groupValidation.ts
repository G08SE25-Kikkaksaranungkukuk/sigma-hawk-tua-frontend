import { CreateGroupRequest } from '@/lib/types';

export interface ValidationErrors {
  group_name?: string;
  description?: string;
  destination?: string;
  max_members?: string;
  start_date?: string;
  end_date?: string;
  interest_fields?: string;
}

export const validateGroupForm = (groupData: CreateGroupRequest): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Group name validation
  if (!groupData.group_name?.trim()) {
    errors.group_name = 'Group name is required';
  } else if (groupData.group_name.trim().length < 3) {
    errors.group_name = 'Group name must be at least 3 characters';
  } else if (groupData.group_name.trim().length > 100) {
    errors.group_name = 'Group name must be less than 100 characters';
  }

  // Description validation
  if (!groupData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (groupData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (groupData.description.trim().length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  // Destination validation
  if (!groupData.destination?.trim()) {
    errors.destination = 'Destination is required';
  } else if (groupData.destination.trim().length < 2) {
    errors.destination = 'Destination must be at least 2 characters';
  }

  // Max members validation
  if (!groupData.max_members || groupData.max_members < 1) {
    errors.max_members = 'Maximum members must be at least 1';
  } else if (groupData.max_members > 50) {
    errors.max_members = 'Maximum members cannot exceed 50';
  }

  // Date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!groupData.start_date) {
    errors.start_date = 'Start date is required';
  } else {
    const startDate = new Date(groupData.start_date);
    startDate.setHours(0, 0, 0, 0);
    if (startDate < today) {
      errors.start_date = 'Start date cannot be in the past';
    }
  }

  if (!groupData.end_date) {
    errors.end_date = 'End date is required';
  } else if (groupData.start_date && groupData.end_date) {
    const startDate = new Date(groupData.start_date);
    const endDate = new Date(groupData.end_date);
    if (endDate <= startDate) {
      errors.end_date = 'End date must be after start date';
    }
  }

  // Interest fields validation
  if (!groupData.interest_fields || groupData.interest_fields.length === 0) {
    errors.interest_fields = 'Please select at least one interest';
  } else if (groupData.interest_fields.length > 5) {
    errors.interest_fields = 'Please select no more than 5 interests';
  }

  return errors;
};

// Individual field validation functions for real-time validation
export const validateGroupName = (groupName?: string): string | undefined => {
  if (!groupName?.trim()) {
    return 'Group name is required';
  } else if (groupName.trim().length < 3) {
    return 'Group name must be at least 3 characters';
  } else if (groupName.trim().length > 100) {
    return 'Group name must be less than 100 characters';
  }
  return undefined;
};

export const validateDescription = (description?: string): string | undefined => {
  if (!description?.trim()) {
    return 'Description is required';
  } else if (description.trim().length < 10) {
    return 'Description must be at least 10 characters';
  } else if (description.trim().length > 500) {
    return 'Description must be less than 500 characters';
  }
  return undefined;
};

export const validateDestination = (destination?: string): string | undefined => {
  if (!destination?.trim()) {
    return 'Destination is required';
  } else if (destination.trim().length < 2) {
    return 'Destination must be at least 2 characters';
  }
  return undefined;
};

export const validateMaxMembers = (maxMembers?: number): string | undefined => {
  if (!maxMembers || maxMembers < 1) {
    return 'Maximum members must be at least 1';
  } else if (maxMembers > 50) {
    return 'Maximum members cannot exceed 50';
  }
  return undefined;
};

export const validateStartDate = (startDate?: Date | string): string | undefined => {
  if (!startDate) {
    return 'Start date is required';
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateToCheck = new Date(startDate);
  dateToCheck.setHours(0, 0, 0, 0);
  
  if (dateToCheck < today) {
    return 'Start date cannot be in the past';
  }
  return undefined;
};

export const validateEndDate = (endDate?: Date | string, startDate?: Date | string): string | undefined => {
  if (!endDate) {
    return 'End date is required';
  }
  
  if (startDate && endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
      return 'End date must be after start date';
    }
  }
  return undefined;
};

export const validateInterestFields = (interestFields?: string[]): string | undefined => {
  if (!interestFields || interestFields.length === 0) {
    return 'Please select at least one interest';
  } else if (interestFields.length > 5) {
    return 'Please select no more than 5 interests';
  }
  return undefined;
};

// Utility function to check if form is valid
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
