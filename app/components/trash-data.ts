// The Trash: habits and mistakes left behind on the way from beginner to engineer.
// Each item says why it was thrown away and what replaced it — edit freely.

export type TrashCategory = 'Software Engineering' | 'Cybersecurity' | 'Intelligent Robotics';

export const TRASH_CATEGORIES: TrashCategory[] = ['Software Engineering', 'Cybersecurity', 'Intelligent Robotics'];

export interface TrashItem {
  name: string;
  category: TrashCategory;
  /** Finder "Kind" column */
  kind: string;
  deleted: string;
  size: string;
  /** Why it ended up in the Trash */
  why: string;
  /** What replaced it */
  replacedBy: string;
}

/** What "Put Back" answers for each category — none of these are coming back. */
export const PUT_BACK_REFUSALS: Record<TrashCategory, string> = {
  'Software Engineering': 'This habit was deprecated in a later release and its support has ended.',
  Cybersecurity: 'Restoring this item would reintroduce a known vulnerability. Request denied.',
  'Intelligent Robotics': 'The firmware has been reflashed. The old behaviour no longer exists on this device.',
};

export const TRASH_ITEMS: TrashItem[] = [
  /* --------------------------- Software Engineering --------------------------- */
  {
    name: 'script.js (one 3,000-line file)', category: 'Software Engineering', kind: 'JavaScript', deleted: 'Mar 2022', size: '212 KB',
    why: 'Every feature, fetch call and DOM tweak lived in one file. Changing a button broke the login.',
    replacedBy: 'Components, modules and layered back ends (Next.js, NestJS, Spring Boot).',
  },
  {
    name: 'final_FINAL_v3_really-final.zip', category: 'Software Engineering', kind: 'ZIP Archive', deleted: 'Jun 2022', size: '48 MB',
    why: 'Version control by renaming folders. Nobody, including me, knew which copy was the real one.',
    replacedBy: 'Git branches, pull requests and GitHub Actions CI.',
  },
  {
    name: 'console.log("here 2").js', category: 'Software Engineering', kind: 'Debug Log', deleted: 'Oct 2022', size: '4 KB',
    why: 'Debugging by sprinkling logs everywhere, then forgetting to remove them before shipping.',
    replacedBy: 'Breakpoints, the debugger and structured logging.',
  },
  {
    name: 'any.ts', category: 'Software Engineering', kind: 'TypeScript', deleted: 'Feb 2023', size: '9 KB',
    why: 'TypeScript, but every type was `any`. All the setup, none of the safety.',
    replacedBy: 'Strict mode, shared types and typed API contracts.',
  },
  {
    name: 'it-works-on-my-machine.txt', category: 'Software Engineering', kind: 'Plain Text', deleted: 'Jul 2023', size: '1 KB',
    why: 'Projects that only ran on my laptop, with my versions, my paths and my luck.',
    replacedBy: 'Docker, pinned dependencies and reproducible builds.',
  },
  {
    name: 'SELECT-star-everywhere.sql', category: 'Software Engineering', kind: 'SQL Script', deleted: 'Nov 2023', size: '6 KB',
    why: 'Fetching whole tables to show three fields. Fine with ten rows, painful with ten thousand.',
    replacedBy: 'Schema design, indexes and ORMs (Prisma, TypeORM).',
  },
  {
    name: 'tutorial-hell', category: 'Software Engineering', kind: 'Folder', deleted: 'Jan 2024', size: '47 items',
    why: 'Watching course after course without building anything of my own.',
    replacedBy: 'Shipping real projects: 25 and counting on GitHub.',
  },

  /* ------------------------------- Cybersecurity ------------------------------ */
  {
    name: 'passwords.txt', category: 'Cybersecurity', kind: 'Plain Text', deleted: 'Apr 2022', size: '2 KB',
    why: 'User passwords stored exactly as typed. One leak would have exposed everyone.',
    replacedBy: 'Salted hashing with bcrypt and argon2.',
  },
  {
    name: '.env (committed to GitHub)', category: 'Cybersecurity', kind: 'Environment File', deleted: 'Aug 2022', size: '1 KB',
    why: 'API keys and database credentials pushed to a public repository.',
    replacedBy: '.gitignore, rotated keys, secret scanning and environment secrets.',
  },
  {
    name: 'query-with-string-concat.php', category: 'Cybersecurity', kind: 'PHP Script', deleted: 'Dec 2022', size: '3 KB',
    why: '"WHERE id = " + input. A textbook SQL injection waiting for a single quote.',
    replacedBy: 'Parameterized queries, input validation and ORMs.',
  },
  {
    name: 'token-in-localStorage.js', category: 'Cybersecurity', kind: 'JavaScript', deleted: 'May 2023', size: '2 KB',
    why: 'Auth tokens readable by any script on the page, so one XSS bug meant a stolen session.',
    replacedBy: 'httpOnly secure cookies, short-lived JWTs and refresh rotation (Secure Campus).',
  },
  {
    name: 'chmod-777-everything.sh', category: 'Cybersecurity', kind: 'Shell Script', deleted: 'Sep 2023', size: '1 KB',
    why: 'Fixing "permission denied" by giving everyone permission to everything.',
    replacedBy: 'Least privilege, role-based access control and audit logs.',
  },
  {
    name: 'password123 (as 2FA).txt', category: 'Cybersecurity', kind: 'Plain Text', deleted: 'Mar 2024', size: '1 KB',
    why: 'Treating a password as the only thing standing between an attacker and an account.',
    replacedBy: 'Multi-factor authentication and WebAuthn passkeys (BioAccess).',
  },
  {
    name: 'security-later.todo', category: 'Cybersecurity', kind: 'To-Do List', deleted: 'Aug 2024', size: '1 KB',
    why: 'Security was the last item on every list, so it never got done.',
    replacedBy: 'Security by design: threat modelling, secure defaults and testing from day one.',
  },

  /* --------------------------- Intelligent Robotics --------------------------- */
  {
    name: 'delay(1000).ino', category: 'Intelligent Robotics', kind: 'Arduino Sketch', deleted: 'May 2022', size: '3 KB',
    why: 'Blocking delays froze the whole robot. It could not read a sensor while it waited.',
    replacedBy: 'Non-blocking millis() timing and state machines.',
  },
  {
    name: 'magic_smoke.log', category: 'Intelligent Robotics', kind: 'Incident Log', deleted: 'Sep 2022', size: '1 KB',
    why: 'Powering motors straight from the Arduino 5V pin. The board did not survive.',
    replacedBy: 'Motor drivers, separate power rails and reading the datasheet first.',
  },
  {
    name: 'hardcoded_wifi_password.ino', category: 'Intelligent Robotics', kind: 'Arduino Sketch', deleted: 'Feb 2023', size: '2 KB',
    why: 'Wi-Fi credentials baked into ESP8266 firmware and shared with every copy of the code.',
    replacedBy: 'Config provisioning, secrets kept out of source and encrypted MQTT.',
  },
  {
    name: 'poll-every-10ms.py', category: 'Intelligent Robotics', kind: 'Python Script', deleted: 'Jun 2023', size: '4 KB',
    why: 'Devices asking "anything new?" a hundred times a second, wasting power and bandwidth.',
    replacedBy: 'Event-driven MQTT publish/subscribe (Division Vision Control).',
  },
  {
    name: 'if-else-computer-vision.py', category: 'Intelligent Robotics', kind: 'Python Script', deleted: 'Oct 2023', size: '18 KB',
    why: 'Hand-tuned colour thresholds that broke the moment the lighting changed.',
    replacedBy: 'Trained models: MediaPipe, YOLO and OpenCV pipelines.',
  },
  {
    name: 'unlabeled_dataset', category: 'Intelligent Robotics', kind: 'Folder', deleted: 'Apr 2024', size: '12,480 items',
    why: 'Thousands of images and no labels, so no model could learn from them.',
    replacedBy: 'A purpose-built labelling tool (Water Meter Labeling Tool).',
  },
  {
    name: 'trained-on-the-test-set.ipynb', category: 'Intelligent Robotics', kind: 'Jupyter Notebook', deleted: 'Sep 2024', size: '2.1 MB',
    why: '99% accuracy, because the model had already seen the answers.',
    replacedBy: 'Proper train, validation and test splits with honest metrics.',
  },
];
