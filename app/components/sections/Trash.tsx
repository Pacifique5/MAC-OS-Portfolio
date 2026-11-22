'use client';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoTrashOutline, IoCodeSlash, IoShieldCheckmark, IoHardwareChip, IoDocumentTextOutline, IoArchiveOutline,
  IoKeyOutline, IoTerminalOutline, IoServerOutline, IoListOutline, IoArrowUndoOutline, IoClose, IoArrowForward,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { useViewport } from '../useViewport';
import { SidebarItem, SidebarSection, ToolbarButton, PushButton } from '../ui/mac';
import { FolderIcon, TrashIcon } from '../icons/AppIcons';
import { TRASH_ITEMS, TRASH_CATEGORIES, PUT_BACK_REFUSALS, TrashCategory, TrashItem } from '../trash-data';

type Filter = 'All' | TrashCategory;

const CATEGORY_ICONS: Record<TrashCategory, IconType> = {
  'Software Engineering': IoCodeSlash,
  Cybersecurity: IoShieldCheckmark,
  'Intelligent Robotics': IoHardwareChip,
};

function FileGlyph({ item, size = 16 }: { item: TrashItem; size?: number }) {
  if (item.kind === 'Folder') return <FolderIcon size={size + 2} />;
  const Icon =
    item.kind === 'ZIP Archive' ? IoArchiveOutline
    : item.kind === 'Environment File' ? IoKeyOutline
    : item.kind === 'SQL Script' ? IoServerOutline
    : item.kind === 'To-Do List' ? IoListOutline
    : /Script|Sketch|JavaScript|TypeScript|Notebook/.test(item.kind) ? IoTerminalOutline
    : IoDocumentTextOutline;
  return <Icon className="shrink-0 text-macblue" style={{ fontSize: size }} />;
}

type Alert = { kind: 'putback'; item: TrashItem } | { kind: 'empty' };

export default function Trash({ full, onEmpty, onRefill }: { full: boolean; onEmpty: () => void; onRefill: () => void }) {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [erasing, setErasing] = useState(false);
  const { touch } = useViewport(true);

  const list = useMemo(() => (full ? TRASH_ITEMS.filter(i => filter === 'All' || i.category === filter) : []), [filter, full]);
  const item = list.find(i => i.name === selected) ?? null;
  const count = (f: Filter) => (full ? TRASH_ITEMS.filter(i => f === 'All' || i.category === f).length : 0);

  const emptyTrash = () => {
    setAlert(null);
    setErasing(true);
    setTimeout(() => { setErasing(false); setSelected(null); onEmpty(); }, 450);
  };

  const sidebar = (
    <>
      <SidebarSection title="Trash">
        <SidebarItem icon={<IoTrashOutline />} label="All Items" badge={count('All') || undefined} active={filter === 'All'} onClick={() => setFilter('All')} />
      </SidebarSection>
      <SidebarSection title="Left Behind In">
        {TRASH_CATEGORIES.map(c => {
          const Icon = CATEGORY_ICONS[c];
          return <SidebarItem key={c} icon={<Icon />} label={c} badge={count(c) || undefined} active={filter === c} onClick={() => setFilter(c)} />;
        })}
      </SidebarSection>
    </>
  );

  const toolbar = (
    <>
      <ToolbarButton title="Put Back" onClick={() => item && setAlert({ kind: 'putback', item })}>
        <IoArrowUndoOutline className={item ? '' : 'opacity-35'} />
      </ToolbarButton>
    </>
  );

  const inspector = item && (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-black/4 dark:bg-white/8 shrink-0"><FileGlyph item={item} size={22} /></span>
        <div className="min-w-0">
          <div className="text-[14px] font-semibold leading-snug wrap-break-word">{item.name}</div>
          <div className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">{item.kind} · {item.size} · Deleted {item.deleted}</div>
        </div>
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45 mb-1">Why it’s in the Trash</div>
        <p className="text-[13px] leading-relaxed text-black/75 dark:text-white/75">{item.why}</p>
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-black/45 dark:text-white/45 mb-1">Replaced by</div>
        <p className="flex items-start gap-1.5 text-[13px] leading-relaxed text-black/85 dark:text-white/85">
          <IoArrowForward className="mt-1 shrink-0 text-macblue" />{item.replacedBy}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-black/50 dark:text-white/50">
        {(() => { const Icon = CATEGORY_ICONS[item.category]; return <Icon className="text-macblue" />; })()}
        {item.category}
      </div>
      <PushButton onClick={() => setAlert({ kind: 'putback', item })}><IoArrowUndoOutline /> Put Back</PushButton>
    </div>
  );

  return (
    <WindowLayout title="Trash" subtitle={full ? `${list.length} items` : 'Empty'} sidebar={sidebar} sidebarWidth={210} toolbar={toolbar}>
      <div className="relative flex flex-col h-full">
        {/* macOS Trash header bar */}
        <div className="flex items-center gap-3 px-4 h-10 shrink-0 border-b border-(--hairline) bg-black/2 dark:bg-white/3">
          <span className="flex-1 min-w-0 truncate text-[12px] text-black/60 dark:text-white/60">
            {full ? 'Old habits I’ve outgrown as an engineer. They are not coming back.' : 'Nothing left to throw away, for now.'}
          </span>
          {full
            ? <PushButton onClick={() => setAlert({ kind: 'empty' })}>Empty</PushButton>
            : <PushButton onClick={onRefill}>Refill</PushButton>}
        </div>

        {full ? (
          <div className="flex flex-1 min-h-0">
            {/* File list */}
            <div className={`@container flex-1 min-w-0 overflow-y-auto mac-scroll p-2 transition-all duration-400 ${erasing ? 'opacity-0 scale-95 translate-y-6' : ''}`} onClick={() => setSelected(null)}>
              <div className="grid grid-cols-[1fr_auto] @xl:grid-cols-[1fr_120px_84px] px-2 pb-1 text-[11px] font-semibold text-black/50 dark:text-white/50 border-b border-(--hairline)">
                <span>Name</span><span className="hidden @xl:block">Kind</span><span className="text-right">Deleted</span>
              </div>
              {list.map((i, n) => {
                const sel = selected === i.name;
                return (
                  <button key={i.name} type="button"
                    onClick={(e) => { e.stopPropagation(); setSelected(sel && touch ? null : i.name); }}
                    onDoubleClick={() => setAlert({ kind: 'putback', item: i })}
                    className={`w-full grid grid-cols-[1fr_auto] @xl:grid-cols-[1fr_120px_84px] items-center gap-2 px-2 h-7 rounded-md text-left text-[13px] ${sel ? 'bg-macblue text-white' : n % 2 ? 'bg-black/3 dark:bg-white/3' : ''}`}>
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={sel ? '[&_svg]:text-white!' : ''}><FileGlyph item={i} /></span>
                      <span className="truncate">{i.name}</span>
                    </span>
                    <span className={`hidden @xl:block truncate ${sel ? 'text-white/80' : 'opacity-60'}`}>{i.kind}</span>
                    <span className={`text-right tabular-nums ${sel ? 'text-white/80' : 'opacity-60'}`}>{i.deleted}</span>
                  </button>
                );
              })}
            </div>

            {/* Inspector beside the list on wide windows */}
            {item && <aside className="hidden @2xl:block w-72 shrink-0 overflow-y-auto mac-scroll border-l border-(--hairline) p-4 animate-fade-in">{inspector}</aside>}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center animate-fade-in">
            <TrashIcon size={96} />
            <div className="text-[15px] font-semibold mt-1">Trash is empty</div>
            <p className="text-[12px] max-w-64 text-black/50 dark:text-white/50">The habits are gone for good. The lessons they taught are kept forever.</p>
          </div>
        )}

        {/* Inspector as a bottom sheet on narrow windows */}
        {item && !erasing && (
          <div className="@2xl:hidden absolute inset-x-0 bottom-0 z-10 max-h-[70%] overflow-y-auto mac-scroll mac-panel rounded-t-xl! p-4 pt-3 animate-slide-up">
            <div className="flex justify-end -mb-2">
              <button type="button" aria-label="Close details" onClick={() => setSelected(null)} className="w-6 h-6 rounded-full flex items-center justify-center bg-black/6 dark:bg-white/10 text-black/60 dark:text-white/70">
                <IoClose className="text-[13px]" />
              </button>
            </div>
            {inspector}
          </div>
        )}

        {/* Alert sheet */}
        {alert && (
          <div className="absolute inset-0 z-20 flex items-start justify-center bg-black/15 dark:bg-black/35 animate-fade-in" onClick={() => setAlert(null)}>
            <div role="alertdialog" aria-modal className="mac-panel mt-10 w-[min(300px,calc(100%-32px))] p-4 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto w-fit mb-2"><TrashIcon size={52} /></div>
              {alert.kind === 'empty' ? (
                <>
                  <div className="text-[13px] font-semibold">Are you sure you want to permanently erase the items in the Trash?</div>
                  <p className="text-[11px] text-black/55 dark:text-white/55 mt-1.5">You can’t undo this action. The lessons stay, though.</p>
                  <div className="flex gap-2 mt-4 *:flex-1">
                    <PushButton onClick={() => setAlert(null)}>Cancel</PushButton>
                    <PushButton primary onClick={emptyTrash}>Empty Trash</PushButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[13px] font-semibold wrap-break-word">“{alert.item.name}” can’t be put back.</div>
                  <p className="text-[11px] text-black/55 dark:text-white/55 mt-1.5">{PUT_BACK_REFUSALS[alert.item.category]}</p>
                  <div className="flex mt-4 *:flex-1">
                    <PushButton primary onClick={() => setAlert(null)}>OK</PushButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </WindowLayout>
  );
}
