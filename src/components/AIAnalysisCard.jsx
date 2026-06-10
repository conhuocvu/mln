import React from 'react';
import { Eye, Lightbulb, Compass, GitCommit, ArrowRight, Sparkles } from 'lucide-react';

export default function AIAnalysisCard({ latestTask, stats, contradictionAnalysis, onShowDetail }) {
  const studyStreak = stats.studyStreak || 0;
  const healthStreak = stats.healthStreak || 0;
  const totalStreak = Math.max(studyStreak, healthStreak);

  // 1. HIỆN TƯỢNG (Phenomenon)
  let hienTuongText = "Hôm nay khu vườn tĩnh lặng, chưa ghi nhận thêm dấu vết thực tiễn hay hạt giống hành động nào được gieo.";
  if (latestTask) {
    hienTuongText = `Bạn vừa gieo hạt giống hành động: "${latestTask.text}". Biểu hiện bên ngoài là sự nỗ lực tác động vào thực tại vật chất trong ngày.`;
  } else if (stats.completedGoalsCount > 0) {
    hienTuongText = `Khu vườn ghi nhận các hành động rèn luyện tích lũy của bạn, phản chiếu qua tán lá và chồi non đang khẽ rung động đón gió.`;
  }

  // 2. BẢN CHẤT (Essence)
  let banChatText = "Bạn đang ở giai đoạn tích lũy sơ khởi. Bản chất của sự tự chủ chưa bộc lộ rõ nét, thế giới quan rèn luyện cần được tưới tắm liên tục.";
  if (totalStreak >= 3) {
    banChatText = `Bạn đang hình thành thói quen rèn luyện ổn định (${totalStreak} ngày liên tiếp) và gia tăng năng lực tự chủ. Lượng tích lũy đang dần hội tụ để tạo bước nhảy về chất.`;
  } else if (stats.kyLuat > 60) {
    banChatText = `Ý chí kỷ luật tự thân vững vàng (${Math.round(stats.kyLuat)}/100) phản ánh bản chất của một lối sống có định hướng, kiểm soát tốt các xung lực lười biếng.`;
  } else if (stats.triThuc > 50) {
    banChatText = `Bản chất của bạn hướng về chiều sâu nhận thức luận: tri thức học hỏi liên tục (${Math.round(stats.triThuc)}/100) đang mở rộng tầm nhìn nội tâm sâu sắc.`;
  }

  // 3. MÂU THUẪN (Contradiction)
  let mauThuanText = "Các mặt đối lập trong lối sống đang thống nhất và dung hòa tốt. Không phát hiện xung đột gay gắt giữa ước muốn và hành vi.";
  if (contradictionAnalysis && contradictionAnalysis.hasContradiction) {
    mauThuanText = `Xung đột biện chứng: ${contradictionAnalysis.details[0]?.reason || contradictionAnalysis.message} Sự lười biếng tạm thời đang phủ định mục tiêu cao cả của bạn.`;
  } else if (stats.apLuc > 55) {
    mauThuanText = `Mâu thuẫn giữa Áp lực ngoại cảnh dâng cao (${Math.round(stats.apLuc)}/100) và Năng lượng tự chủ. Bạn cần tĩnh lặng để chuyển hóa thách thức thành cơ hội phát triển.`;
  }

  // 4. XU HƯỚNG PHÁT TRIỂN (Development Trend)
  let xuHuongText = "Nếu tiếp tục gieo hạt giống hành động đều đặn trong 5 ngày tới, hệ sinh thái nhân cách sẽ bắt đầu chớm nở hoa giá trị đầu tiên.";
  if (stats.evolutionStage === 2) {
    xuHuongText = "Nếu hoàn thành thêm rèn luyện thực tiễn, mầm non non trẻ này sẽ chuyển hóa về chất, vươn cao thành cây tơ tích lũy kiêu hãnh.";
  } else if (stats.evolutionStage === 4) {
    xuHuongText = "Giải quyết được mâu thuẫn biện chứng hiện tại sẽ giúp rũ bỏ cành khô úa rụng và mở khóa cành vàng kim đột phá.";
  } else if (stats.studyStreak > 0 && stats.studyStreak < 3) {
    xuHuongText = `Duy trì chuỗi tự học thêm ${3 - stats.studyStreak} ngày nữa, nhánh Trí Tuệ của cây nhân sinh sẽ nở rộ đóa hoa Anh Đào rực rỡ.`;
  }

  // 5. HẠT GIỐNG TIẾP THEO (Next Seed)
  let hatGiongText = "Có lẽ khu vườn sẽ được hưởng lợi từ một khoảnh khắc tĩnh lặng phản tư để lắng nghe những chuyển động âm thầm của thế giới quan.";
  if (stats.kyLuat < 45) {
    hatGiongText = "Có lẽ khu vườn sẽ được tiếp thêm sinh khí từ một hạt giống Kỷ luật nhỏ vào ngày mai, như việc hoàn thành một thử thách nhỏ tự thân.";
  } else if (stats.sucKhoe < 45) {
    hatGiongText = "Một hạt giống về sinh lực có thể mang lại giá trị lớn để nuôi dưỡng và tái cân bằng thể chất của bạn lúc này.";
  } else if (stats.triThuc < 45) {
    hatGiongText = "Có thể khu vườn cần thêm một hạt giống Trí tuệ để đắp bồi nhận thức luận, thông qua việc đọc vài trang sách sâu sắc.";
  } else if (contradictionAnalysis && contradictionAnalysis.hasContradiction) {
    hatGiongText = "Một hạt giống phản tư và tĩnh tâm có thể giúp bạn làm rõ những mâu thuẫn bên trong, từ đó thúc đẩy bước phát triển mới.";
  } else if (stats.sangTao < 45) {
    hatGiongText = "Có lẽ một chồi non sáng tạo, viết lách hoặc đàn hát sẽ mang lại sự hài hòa cho hệ sinh thái nhân cách hôm nay.";
  }

  return (
    <div className="glass-dark rounded-3xl p-5 border border-white/10 shadow-lg text-white space-y-4">
      <h3 className="text-base font-extrabold flex items-center gap-1.5 border-b border-white/10 pb-2.5">
        <span className="text-amber-500">✨</span> Hôm nay bạn đang trở thành ai?
      </h3>

      <div className="space-y-3">
        {/* Hiện tượng */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 relative overflow-hidden">
          <span className="text-[11.5px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Hiện tượng:
          </span>
          <p className="text-[13px] md:text-[13.5px] text-slate-800 leading-relaxed font-bold">
            {hienTuongText}
          </p>
        </div>

        {/* Bản chất */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 relative overflow-hidden">
          <span className="text-[11.5px] font-bold text-teal-850 uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-teal-600" /> Bản chất:
          </span>
          <p className="text-[13px] md:text-[13.5px] text-slate-800 leading-relaxed font-medium">
            {banChatText}
          </p>
        </div>

        {/* Mâu thuẫn */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 relative overflow-hidden">
          <span className="text-[11.5px] font-bold text-red-800 uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-red-600" /> Mâu thuẫn:
          </span>
          <p className="text-[13px] md:text-[13.5px] text-slate-800 leading-relaxed font-medium">
            {mauThuanText}
          </p>
        </div>

        {/* Xu hướng phát triển */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 relative overflow-hidden">
          <span className="text-[11.5px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <GitCommit className="w-3.5 h-3.5 text-amber-600" /> Xu hướng phát triển:
          </span>
          <p className="text-[13px] md:text-[13.5px] text-slate-800 leading-relaxed font-medium">
            {xuHuongText}
          </p>
        </div>

        {/* Hạt giống tiếp theo */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 relative overflow-hidden">
          <span className="text-[11.5px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Hạt giống tiếp theo:
          </span>
          <p className="text-[13px] md:text-[13.5px] text-slate-800 leading-relaxed font-medium">
            {hatGiongText}
          </p>
        </div>
      </div>

      <button
        onClick={onShowDetail}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
      >
        Chiêm nghiệm sâu sắc <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
