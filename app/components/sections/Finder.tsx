'use client';
import { useState } from 'react';
import { IoDesktopOutline, IoDocumentTextOutline, IoArrowDownCircleOutline, IoAppsOutline, IoTimeOutline, IoCloudOutline, IoLaptopOutline, IoGridOutline, IoListOutline, IoSearch, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { SidebarItem, SidebarSection, ToolbarButton } from '../ui/mac';
import { FolderIcon } from '../icons/AppIcons';
import { APPS, SECTION_IDS } from '../apps';

const TAGS = [
  { name: 'Red', color: '#ff3b30' }, { name: 'Orange', color: '#ff9500' }, { name: 'Green', color: '#34c759' },
  { name: 'Blue', color: '#007aff' }, { name: 'Purple', color: '#af52de' },
];

export default function Finder({ onOpen }: { onOpen: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<'icons' | 'list'>('icons');

  const sidebar = (
    <>
      <SidebarSection title="Favorites">
        <SidebarItem icon={<IoTimeOutline />} label="Recents" />
        <SidebarItem icon={<IoAppsOutline />} label="Applications" />
        <SidebarItem icon={<IoDesktopOutline />} label="Desktop" active />
        <SidebarItem icon={<IoDocumentTextOutline />} label="Documents" />
        <SidebarItem icon={<IoArrowDownCircleOutline />} label="Downloads" />
      </SidebarSection>
      <SidebarSection title="iCloud">
        <SidebarItem icon={<IoCloudOutline />} label="iCloud Drive" />
      </SidebarSection>
      <SidebarSection title="Locations">
        <SidebarItem icon={<IoLaptopOutline />} label="Pacifique’s MacBook Pro" />
      </SidebarSection>
      <SidebarSection title="Tags">
        {TAGS.map(t => (
          <SidebarItem key={t.name} icon={<span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />} label={t.name} />
        ))}
      </SidebarSection>
    </>
  );

  const toolbar = (
    <>
      <ToolbarButton title="Back"><IoChevronBack /></ToolbarButton>
      <ToolbarButton title="Forward"><IoChevronForward className="opacity-40" /></ToolbarButton>
      <div className="w-2" />
      <ToolbarButton title="Icons" active={view === 'icons'} onClick={() => setView('icons')}><IoGridOutline /></ToolbarButton>
      <ToolbarButton title="List" active={view === 'list'} onClick={() => setView('list')}><IoListOutline /></ToolbarButton>
      <div className="w-2" />
      <ToolbarButton title="Search"><IoSearch /></ToolbarButton>
    </>
  );

  return (
    <WindowLayout title="Desktop" sidebar={sidebar} toolbar={toolbar}>
      <div className="flex flex-col h-full" onClick={() => setSelected(null)}>
        <div className="flex-1 p-5">
          {view === 'icons' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-y-4">
              {SECTION_IDS.map(id => {
                const app = APPS[id];
                const sel = selected === id;
                return (
                  <button key={id} type="button" className="flex flex-col items-center gap-1 outline-none"
                    onClick={(e) => { e.stopPropagation(); setSelected(id); }}
                    onDoubleClick={() => onOpen(id)}>
                    <span className={`p-1 rounded-md ${sel ? 'bg-black/8 dark:bg-white/12' : ''}`}>
                      <FolderIcon size={68} Glyph={app.folderGlyph} />
                    </span>
                    <span className={`text-[12px] px-1.5 rounded ${sel ? 'bg-macblue text-white' : ''}`}>{app.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-[13px]">
              <div className="grid grid-cols-[1fr_120px_90px] px-2 pb-1 text-[11px] font-semibold text-black/50 dark:text-white/50 border-b border-(--hairline)">
                <span>Name</span><span>Kind</span><span className="text-right">Items</span>
              </div>
              {SECTION_IDS.map((id, i) => (
                <button key={id} type="button"
                  onClick={(e) => { e.stopPropagation(); setSelected(id); }}
                  onDoubleClick={() => onOpen(id)}
                  className={`w-full grid grid-cols-[1fr_120px_90px] items-center px-2 h-7 rounded-md text-left ${selected === id ? 'bg-macblue text-white' : i % 2 ? 'bg-black/3 dark:bg-white/3' : ''}`}>
                  <span className="flex items-center gap-2"><FolderIcon size={18} />{APPS[id].label}</span>
                  <span className="opacity-60">Folder</span>
                  <span className="opacity-60 text-right">—</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="h-6 flex items-center justify-center text-[11px] text-black/45 dark:text-white/45 border-t border-(--hairline)">
          {selected ? `1 of ${SECTION_IDS.length} selected` : `${SECTION_IDS.length} items`} · Double-click to open
        </div>
      </div>
    </WindowLayout>
  );
}
