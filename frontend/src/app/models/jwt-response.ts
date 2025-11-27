/**
 * User DTO Interface
 * Represents the user object returned in the auth response
 */
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
}

/**
 * JWT Response Interface
 * 
 * Represents the structure of the response object returned by the backend
 * after a successful login or registration.
 */
export interface JwtResponse {
  // The JWT token itself
  token: string;
  
  // Type of token (usually "Bearer")
  type: string;
  
  // User information object
  user: UserInfo;
  
  // Response message
  message: string;
}
