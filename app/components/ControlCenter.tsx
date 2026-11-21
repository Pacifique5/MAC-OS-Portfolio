'use client';
import { CCSlider, CircleIcon } from './ui/mac';
import {
  WifiGlyph, WifiOffGlyph, BluetoothGlyph, AirDropGlyph, MoonGlyph, StageManagerGlyph, ScreenMirrorGlyph,
  SunGlyph, SpeakerGlyph, PlayGlyph, ForwardGlyph,
} from './icons/SystemIcons';
import { SystemState, volumeLevel } from './useSystem';

export default function ControlCenter({ sys }: { sys: SystemState }) {
  const btStatus = !sys.btSupported ? 'Unavailable' : sys.btOn ? (sys.btDevices.length ? `${sys.btDevices.length} connected` : 'On') : 'Off';

  return (
    <div className="mac-panel w-[320px] p-2.5 grid gap-2.5" onClick={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Connectivity */}
        <div className="mac-tile p-2.5 space-y-2.5">
          <button type="button" className="flex items-center gap-2 w-full text-left" onClick={sys.toggleWifi}>
            <CircleIcon active={sys.wifiOn}>{sys.wifiOn ? <WifiGlyph size={11} /> : <WifiOffGlyph size={11} />}</CircleIcon>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold leading-tight">Wi-Fi</span>
              <span className="block text-[11px] opacity-55 truncate leading-tight">{sys.wifiOn ? (sys.connectedNetwork || 'Searching…') : 'Off'}</span>
            </span>
          </button>
          <button type="button" className="flex items-center gap-2 w-full text-left disabled:opacity-60" disabled={!sys.btSupported} onClick={() => sys.setBtOn(!sys.btOn)}>
            <CircleIcon active={sys.btSupported && sys.btOn}><BluetoothGlyph size={12} /></CircleIcon>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold leading-tight">Bluetooth</span>
              <span className="block text-[11px] opacity-55 truncate leading-tight">{btStatus}</span>
            </span>
          </button>
          <button type="button" className="flex items-center gap-2 w-full text-left" onClick={sys.cycleAirdrop}>
            <CircleIcon active={sys.airdrop !== 'Receiving Off'}><AirDropGlyph size={13} /></CircleIcon>
            <span className="min-w-0">
              <span className="block text-[12px] font-semibold leading-tight">AirDrop</span>
              <span className="block text-[11px] opacity-55 truncate leading-tight">{sys.airdrop}</span>
            </span>
          </button>
        </div>

        <div className="grid gap-2.5">
          <button type="button" className="mac-tile p-2.5 flex items-center gap-2 text-left" onClick={() => sys.setFocusOn(!sys.focusOn)}>
            <CircleIcon active={sys.focusOn}><MoonGlyph size={12} /></CircleIcon>
            <span>
              <span className="block text-[12px] font-semibold leading-tight">Focus</span>
              {sys.focusOn && <span className="block text-[11px] opacity-55 leading-tight">Do Not Disturb</span>}
            </span>
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" title="Stage Manager" onClick={() => sys.setStageManager(!sys.stageManager)}
              className={`mac-tile flex flex-col items-center justify-center gap-1 py-2 ${sys.stageManager ? '!bg-[var(--mac-blue)] !text-white' : ''}`}>
              <StageManagerGlyph size={15} />
              <span className="text-[9px] leading-tight text-center opacity-80">Stage<br />Manager</span>
            </button>
            <button type="button" title="Screen Mirroring" className="mac-tile flex flex-col items-center justify-center gap-1 py-2">
              <ScreenMirrorGlyph size={15} />
              <span className="text-[9px] leading-tight text-center opacity-80">Screen<br />Mirroring</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mac-tile p-2.5">
        <div className="text-[12px] font-semibold mb-1.5">Display</div>
        <CCSlider value={sys.brightness} min={10} max={100} onChange={sys.setBrightness} icon={<SunGlyph size={12} />} />
      </div>

      <div className="mac-tile p-2.5">
        <div className="text-[12px] font-semibold mb-1.5">Sound</div>
        <CCSlider value={sys.volume} onChange={sys.setVolume} icon={<SpeakerGlyph size={11} level={volumeLevel(sys.volume)} />} />
      </div>

      <div className="mac-tile p-2.5 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-md bg-[rgba(120,120,128,0.2)] flex items-center justify-center opacity-70">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M12 1.5v8.8a2.3 2.3 0 1 1-1.5-2.1V4.1L6 5.2v6.6a2.3 2.3 0 1 1-1.5-2.1V3.3z" /></svg>
        </div>
        <div className="flex-1 text-[12px] font-semibold opacity-80">Not Playing</div>
        <PlayGlyph size={14} className="opacity-80" />
        <ForwardGlyph size={13} className="opacity-35" />
      </div>
    </div>
  );
}
