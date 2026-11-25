'use client';
import type { IconType } from 'react-icons';
import { IoLogoGithub, IoLogoLinkedin, IoPerson, IoHammer, IoSparkles, IoSchool, IoChatbubbles, IoMail, IoDownload } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import {
  FinderIcon, LaunchpadIcon, TerminalIcon, PhotosIcon, CalendarIcon, SettingsIcon, TrashIcon,
  ContactsIcon, ProjectsIcon, SkillsIcon, ExperienceIcon, MessagesIcon, MailIcon, BrandTile, SlackIcon, FolderIcon,
} from './icons/AppIcons';

export type WindowId = 'finder' | 'photos' | 'terminal' | 'trash' | 'calendar' | 'about' | 'projects' | 'skills' | 'experience' | 'testimonials' | 'contact';

/** CV served from /public — replace the file and update this path when the CV changes. */
export const CV_URL = '/Mugisha%20Pacifique%20CV.pdf';

/** Social links used by the Dock, Launchpad and Spotlight — edit them here. */
export const SOCIAL_LINKS = {
  github: 'https://github.com/Pacifique5',
  linkedin: 'https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/',
  slack: 'https://codewithpacifique.slack.com',
  x: 'https://x.com/_fiquem',
};

type AppAction =
  | { type: 'window'; window: WindowId }
  | { type: 'link'; href: string }
  | { type: 'download'; href: string; filename: string }
  | { type: 'launchpad' }
  | { type: 'controlcenter' }
  | { type: 'notifications' }
  | { type: 'none' };

export interface AppDef {
  id: string;
  label: string;
  /** Category shown in Spotlight results */
  kind: string;
  Icon: (p: { size?: number }) => React.ReactElement;
  action: AppAction;
  /** SF-style symbol embossed on the desktop folder */
  folderGlyph?: IconType;
}

const GitHubIcon = ({ size }: { size?: number }) => <BrandTile size={size} bg={['#3b4148', '#16191d']} Glyph={IoLogoGithub} />;
const LinkedInIcon = ({ size }: { size?: number }) => <BrandTile size={size} bg={['#1c8ae6', '#0a58b0']} Glyph={IoLogoLinkedin} glyphScale={0.6} />;
const CvIcon = ({ size }: { size?: number }) => <FolderIcon size={size} Glyph={IoDownload} />;
const XIcon = ({ size }: { size?: number }) => <BrandTile size={size} bg={['#2a2a2c', '#000000']} Glyph={FaXTwitter} glyphScale={0.48} />;

export const APPS: Record<string, AppDef> = {
  finder:       { id: 'finder',       label: 'Finder',       kind: 'Application', Icon: FinderIcon,    action: { type: 'window', window: 'finder' } },
  launchpad:    { id: 'launchpad',    label: 'Launchpad',    kind: 'Application', Icon: LaunchpadIcon, action: { type: 'launchpad' } },
  terminal:     { id: 'terminal',     label: 'Terminal',     kind: 'Application', Icon: TerminalIcon,  action: { type: 'window', window: 'terminal' } },
  photos:       { id: 'photos',       label: 'Photos',       kind: 'Application', Icon: PhotosIcon,    action: { type: 'window', window: 'photos' } },
  calendar:     { id: 'calendar',     label: 'Calendar',     kind: 'Application', Icon: CalendarIcon,  action: { type: 'window', window: 'calendar' } },
  cv:           { id: 'cv',           label: 'My CV',        kind: 'Download',    Icon: CvIcon,        action: { type: 'download', href: CV_URL, filename: 'Mugisha Pacifique CV.pdf' }, folderGlyph: IoDownload },

  about:        { id: 'about',        label: 'About Me',     kind: 'Folder', Icon: ContactsIcon,   action: { type: 'window', window: 'about' },        folderGlyph: IoPerson },
  projects:     { id: 'projects',     label: 'Projects',     kind: 'Folder', Icon: ProjectsIcon,   action: { type: 'window', window: 'projects' },     folderGlyph: IoHammer },
  skills:       { id: 'skills',       label: 'Skills',       kind: 'Folder', Icon: SkillsIcon,     action: { type: 'window', window: 'skills' },       folderGlyph: IoSparkles },
  experience:   { id: 'experience',   label: 'Experience',   kind: 'Folder', Icon: ExperienceIcon, action: { type: 'window', window: 'experience' },   folderGlyph: IoSchool },
  testimonials: { id: 'testimonials', label: 'Testimonials', kind: 'Folder', Icon: MessagesIcon,   action: { type: 'window', window: 'testimonials' }, folderGlyph: IoChatbubbles },
  contact:      { id: 'contact',      label: 'Contact',      kind: 'Folder', Icon: MailIcon,       action: { type: 'window', window: 'contact' },      folderGlyph: IoMail },

  github:       { id: 'github',       label: 'GitHub',       kind: 'Website', Icon: GitHubIcon,    action: { type: 'link', href: SOCIAL_LINKS.github } },
  linkedin:     { id: 'linkedin',     label: 'LinkedIn',     kind: 'Website', Icon: LinkedInIcon,  action: { type: 'link', href: SOCIAL_LINKS.linkedin } },
  x:            { id: 'x',            label: 'X',            kind: 'Website', Icon: XIcon,         action: { type: 'link', href: SOCIAL_LINKS.x } },
  slack:        { id: 'slack',        label: 'Slack',        kind: 'Website', Icon: SlackIcon,     action: { type: 'link', href: SOCIAL_LINKS.slack } },
  settings:     { id: 'settings',     label: 'System Settings', kind: 'Application', Icon: SettingsIcon, action: { type: 'controlcenter' } },
  trash:        { id: 'trash',        label: 'Trash',        kind: 'Folder', Icon: TrashIcon,      action: { type: 'window', window: 'trash' } },
};

/** The six portfolio sections, in desktop order. */
export const SECTION_IDS = ['about', 'projects', 'skills', 'experience', 'testimonials', 'contact'] as const;

/** Dock layout — `null` renders a separator. */
export const DOCK_LAYOUT: (string | null)[] = [
  'finder', 'launchpad', 'terminal', 'photos', 'calendar',
  null,
  ...SECTION_IDS,
  null,
  'github', 'linkedin', 'x', 'slack', 'settings',
];

export const WINDOW_TITLES: Record<WindowId, string> = {
  finder: 'Finder',
  photos: 'Photos',
  terminal: 'Terminal',
  trash: 'Trash',
  calendar: 'Calendar',
  about: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  testimonials: 'Testimonials',
  contact: 'Contact',
};
