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
  /** Marks an illustrative entry. It is labelled "Example" and left out of the counts. */
  example?: boolean;
}

/** Limits shared by the form and the API. */
export const TEXT_MIN = 40;
export const TEXT_MAX = 1200;

export const TESTIMONIALS: Testimonial[] = [
  // Examples showing how recommendations appear. Delete them once real ones are published.
  {
    name: 'Mutoni Grace',
    role: 'Tech Lead',
    organisation: 'Example company',
    relationship: 'Manager',
    date: 'November 2026',
    text: 'Pacifique picks things up fast and asks the right questions. He took a vague feature request, turned it into a clear plan and shipped it with tests and documentation. Security was never an afterthought in his work.',
    example: true,
  },
  {
    name: 'Habimana Eric',
    role: 'Software Engineer',
    organisation: 'Example team',
    relationship: 'Colleague',
    date: 'October 2026',
    text: 'Working with Pacifique on a full-stack project was easy: clean pull requests, honest estimates, and he always left the codebase better than he found it.',
    example: true,
  },
  {
    name: 'Iradukunda Claudine',
    role: 'Robotics Mentor',
    organisation: 'Example programme',
    relationship: 'Mentor',
    date: 'September 2026',
    text: 'Curious, persistent and hands-on. Whether it was wiring an ESP8266 or training a vision model, Pacifique kept experimenting until it worked, and then explained it clearly to everyone else.',
    example: true,
  },
];

/** Recommendations from real people (examples excluded). */
export const REAL_TESTIMONIAL_COUNT = TESTIMONIALS.filter(t => !t.example).length;
