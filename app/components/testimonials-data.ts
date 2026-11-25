// Recommendations shown in the Testimonials app.
//
// People submit them through "Write a Recommendation"; each one arrives by email with a ready-made
// entry. Paste the entries you approve into TESTIMONIALS below (newest first) and push.

export const RELATIONSHIPS = ['Lecturer', 'Mentor', 'Manager', 'Colleague', 'Classmate', 'Client', 'Other'] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

export interface Testimonial {
  name: string;
  /** Their title, e.g. "Software Engineering Lecturer" */
  role: string;
  /** School or company, e.g. "Rwanda Coding Academy" */
  organisation: string;
  relationship: Relationship;
  /** Month it was written, e.g. "November 2026" */
  date: string;
  text: string;
  /** Optional: lets visitors verify the person */
  linkedin?: string;
}

/** Limits shared by the form and the API. */
export const TEXT_MIN = 40;
export const TEXT_MAX = 1200;

export const TESTIMONIALS: Testimonial[] = [];
