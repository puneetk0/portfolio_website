function Frame() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] font-normal gap-[51px] items-center leading-[0] relative shrink-0 text-[#666] text-[0px]">
      <p className="relative shrink-0">
        <span className="leading-[1.8] text-[14px]">{`projects `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[01]</span>
      </p>
      <p className="relative shrink-0">
        <span className="leading-[1.8] text-[14px]">{`and ? `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[02]</span>
      </p>
      <p className="relative shrink-0">
        <span className="leading-[1.8] text-[14px]">{`process `}</span>
        <span className="leading-[1.8] text-[9.030000000000001px]">[03]</span>
      </p>
      <p className="relative shrink-0">
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
    <div className="bg-[#141414] relative size-full whitespace-nowrap" data-name="MacBook Pro 14' - 1">
      <div className="absolute font-['Geist:Regular',sans-serif] font-normal leading-[0] left-[142px] text-[0px] text-white top-[calc(50%-204px)]">
        <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[1.8] mb-0 text-[#666] text-[20px] whitespace-pre">{`Hi, I'm Puneet. `}</p>
        <p className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-[1.8] mb-0 text-[24px] whitespace-pre">I design and build products that people actually use.</p>
        <p className="leading-[normal] mb-0 text-[24px] whitespace-pre">​</p>
        <p className="leading-[normal] mb-0 text-[24px] whitespace-pre">​</p>
        <p className="font-['Figtree:Regular',sans-serif] leading-[normal] mb-0 text-[#666] text-[18px] whitespace-pre">{`//What I’m building`}</p>
        <p className="leading-[normal] mb-0 text-[24px] whitespace-pre">​</p>
        <p className="mb-0 whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-none text-[20px]">Voca Form</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-none text-[20px]">{` `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-none text-[#666] text-[19px]">Conversational AI that turns forms into stories</span>
        </p>
        <p className="leading-[normal] mb-0 text-[20px] whitespace-pre">​</p>
        <p className="whitespace-pre">
          <span className="font-['Figtree:SemiBold',sans-serif] font-semibold leading-none text-[20px]">Camber</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-none text-[20px]">{` `}</span>
          <span className="font-['Figtree:Regular',sans-serif] font-normal leading-none text-[#666] text-[19px]">{`F1-themed task manager that lives in your Mac's notch`}</span>
        </p>
      </div>
      <Frame1 />
      <p className="absolute font-['Geist:Regular',sans-serif] font-normal leading-[0] left-[1280px] text-[0px] text-white top-[905px]">
        <span className="font-['Geist:Thin',sans-serif] font-thin leading-[normal] text-[18px]">[</span>
        <span className="leading-[normal] text-[18px]">{` /`}</span>
        <span className="leading-[normal] text-[#666] text-[18px]">{`//// `}</span>
        <span className="font-['Geist:Thin',sans-serif] font-thin leading-[normal] text-[18px]">]</span>
        <span className="leading-[normal] text-[18px]">{` `}</span>
        <span className="leading-[normal] text-[14px] tracking-[0.42px]">1/5</span>
      </p>
    </div>
  );
}