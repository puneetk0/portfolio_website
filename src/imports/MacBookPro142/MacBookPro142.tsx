function Frame() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] font-normal gap-[51px] items-center leading-[0] relative shrink-0 text-[0px]">
      <p className="relative shrink-0 text-white">
        <span className="[text-decoration-skip-ink:none] decoration-solid leading-[1.8] text-[14px] underline">{`projects `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[01]</span>
      </p>
      <p className="relative shrink-0 text-[#666]">
        <span className="leading-[1.8] text-[14px]">{`and ? `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[02]</span>
      </p>
      <p className="relative shrink-0 text-[#666]">
        <span className="leading-[1.8] text-[14px]">{`process `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[03]</span>
      </p>
      <p className="relative shrink-0 text-[#666]">
        <span className="leading-[1.8] text-[14px]">{`contact `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[04]</span>
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 top-[27px] w-[1228px]">
      <p className="font-['Geist:SemiBold',sans-serif] font-semibold leading-[1.8] relative shrink-0 text-[14px] text-white">P.</p>
      <Frame />
    </div>
  );
}

export default function MacBookPro() {
  return (
    <div className="bg-[#141414] relative size-full whitespace-nowrap" data-name="MacBook Pro 14' - 2">
      <div className="absolute font-['Geist:Regular',sans-serif] font-normal leading-[0] left-[142px] text-[0px] text-white top-[calc(50%-204px)]">
        <p className="font-['Figtree:Regular',sans-serif] leading-[normal] mb-0 text-[#666] text-[18px] whitespace-pre">{`//Selected Projects`}</p>
        <p className="leading-[normal] mb-0 text-[24px] whitespace-pre">​</p>
        <p className="mb-0 whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[2] text-[20px]">{`Sportsolio `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[2] text-[#666] text-[19px]">Trade emerging players like stocks</span>
        </p>
        <p className="mb-0 whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[2] text-[20px]">{`GitRepo `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[2] text-[#666] text-[19px]">Find open source repos by chatting with AI</span>
        </p>
        <p className="mb-0 whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[2] text-[20px]">{`Visual Vortex `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[2] text-[#666] text-[19px]">Brand identity - theme, social, web, mailers</span>
        </p>
        <p className="whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[2] text-[20px]">{`HiGrow `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-[2] text-[#666] text-[19px]">Marketplace for hosting and joining workshops</span>
        </p>
      </div>
      <Frame1 />
      <p className="absolute font-['Geist:Regular',sans-serif] font-normal leading-[0] left-[1280px] text-[0px] text-white top-[905px]">
        <span className="font-['Geist:Thin',sans-serif] font-thin leading-[normal] text-[18px]">[</span>
        <span className="leading-[normal] text-[18px]">{` //`}</span>
        <span className="leading-[normal] text-[#666] text-[18px]">{`/// `}</span>
        <span className="font-['Geist:Thin',sans-serif] font-thin leading-[normal] text-[18px]">]</span>
        <span className="leading-[normal] text-[18px]">{` `}</span>
        <span className="leading-[normal] text-[14px] tracking-[0.42px]">2/5</span>
      </p>
    </div>
  );
}