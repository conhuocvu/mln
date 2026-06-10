export function generateDailyReflection(completedTasks, stats) {
  if (completedTasks.length === 0) {
    return {
      title: "Khoảng Lặng Biện Chứng",
      content: "Hôm nay khu vườn trải qua một ngày tĩnh lặng. Trong triết học, đứng im chỉ là tương đối, vận động mới là tuyệt đối. Dù không có hoạt động hiển hiện nào, cơ thể và tâm trí bạn vẫn đang chuyển hóa âm thầm. Hãy sẵn sàng gieo những hạt giống nguyên nhân mới vào ngày mai để tiếp tục tiến trình phát triển.",
      principle: "Vận động và Đứng im",
      advice: "Hãy bắt đầu bằng một hành động rất nhỏ ngày mai: Đọc 2 trang sách hoặc đi bộ 5 phút để kích hoạt lại chuỗi nhân quả."
    };
  }

  const positiveTasks = completedTasks.filter(t => !t.analysis.thayDoiChiSo.kyLuat || t.analysis.thayDoiChiSo.kyLuat >= 0);
  const negativeTasks = completedTasks.filter(t => t.analysis.thayDoiChiSo.kyLuat < 0);
  
  // Xác định quy luật chủ đạo của ngày hôm nay
  let principle = "Mối liên hệ phổ biến và Quan hệ nhân quả";
  let explanation = "";
  let title = "Chiêm Nghiệm Thực Tiễn";

  if (completedTasks.length >= 4) {
    principle = "Quy luật lượng đổi dẫn đến chất đổi";
    title = "Sự Tích Lũy Về Lượng";
    explanation = `Bạn đã hoàn thành ${completedTasks.length} công việc hôm nay. Mỗi hành động như ${completedTasks[0].text} hay ${completedTasks[1]?.text || "các công việc khác"} là những hạt cát nhỏ của Lượng. Chúng đang tích tụ để chuẩn bị cho một bước nhảy vọt làm thay đổi Chất của khu vườn và chính con người bạn. Hãy nhớ rằng không có thành công nào đột ngột xuất hiện, nó là kết quả của sự tích lũy bền bỉ.`;
  } else if (negativeTasks.length > 0 && positiveTasks.length > 0) {
    principle = "Quy luật thống nhất và đấu tranh của các mặt đối lập";
    title = "Đấu Tranh Biện Chứng";
    explanation = `Hôm nay bạn vừa hoàn thành những hành động tích cực (như ${positiveTasks[0].text}) vừa có những phút giây trì hoãn hoặc lãng phí thời gian (như ${negativeTasks[0].text}). Đây là minh chứng rõ nét cho sự thống nhất và đấu tranh giữa hai mặt đối lập trong ý thức của bạn: Kỷ luật và Trì trệ. Sự tiến bộ không phải là một đường thẳng sạch sẽ, mà là kết quả của việc đấu tranh vượt qua những lực cản để vươn lên.`;
  } else if (positiveTasks.length > 0 && stats.apLuc > 55) {
    principle = "Phủ định của phủ định";
    title = "Vượt Lên Nghịch Cảnh";
    explanation = `Dù đang chịu áp lực lớn (chỉ số Áp Lực: ${Math.round(stats.apLuc)}/100), bạn vẫn kiên cường hoàn thành các công việc quan trọng. Triết học Mác-Lênin chỉ ra rằng cái mới tiến bộ luôn vươn lên bằng cách phủ định cái cũ trì trệ qua nhiều gian nan. Áp lực hiện tại chỉ là phép thử để khẳng định bản lĩnh phát triển bền vững của bạn.`;
  } else {
    explanation = `Hôm nay bạn đã hoàn thành công việc: "${completedTasks[0].text}". Dưới lăng kính của Mối liên hệ phổ biến, hành động này gửi tín hiệu tích cực tới toàn bộ hệ thống chỉ số ẩn của bạn, làm tăng Trí thức, Sức khỏe hay Kỷ luật. Không có hành động nào cô lập; mỗi lựa chọn của bạn đều lay động toàn bộ khu vườn nhân sinh.`;
  }

  // Lời khuyên phát triển bản thân dựa trên chỉ số thấp nhất
  let lowStat = "kyLuat";
  let minVal = 100;
  Object.keys(stats).forEach(key => {
    if (stats[key] < minVal && key !== "apLuc") {
      minVal = stats[key];
      lowStat = key;
    }
  });

  const adviceMap = {
    phatTrien: "Hãy tập trung vào những mục tiêu lớn hơn, hoàn thành đồ án hoặc dự án cốt lõi để nâng cao tầm vóc cuộc đời.",
    sucKhoe: "Sức khỏe vật chất là bệ đỡ cho tinh thần. Hãy dành thời gian chạy bộ, tập gym hoặc ngủ đủ giấc.",
    triThuc: "Trí tuệ cần được bồi đắp mỗi ngày. Đọc sách hoặc học ngoại ngữ 15 phút sẽ làm bừng sáng góc vườn tri thức.",
    kyLuat: "Kỷ luật tạo nên sự tự do đích thực. Hãy cố gắng thức dậy đúng giờ và hoàn thành danh sách công việc đúng hạn.",
    camXuc: "Nuôi dưỡng tâm hồn bằng âm nhạc, thiền, hoặc dành thời gian kết nối với thiên nhiên để bầu trời quang đãng hơn.",
    moiQuanHe: "Con người là tổng hòa của các mối quan hệ. Một cuộc gọi ngắn cho gia đình hoặc giúp đỡ bạn bè sẽ làm bướm bay đầy vườn.",
    sangTao: "Đừng ngần ngại thử sức với nghệ thuật, viết lách, hoặc giải quyết một vấn đề cũ bằng phương pháp mới.",
    kienTri: "Con đường dài vạn dặm bắt đầu bằng những bước chân đầu tiên. Hãy duy trì thói quen học tập/luyện tập liên tục.",
    tuTin: "Sự tự tin đến từ việc hoàn thành những mục tiêu nhỏ hàng ngày. Hãy ghi nhận những nỗ lực dù là nhỏ nhất của chính mình."
  };

  const advice = adviceMap[lowStat] || "Hãy tiếp tục hành động thực tiễn để rèn luyện bản thân.";

  const content = `Hôm nay bạn đã hoàn thành ${completedTasks.length} hành động thực tiễn. ${explanation} Hệ chỉ số ẩn của bạn hiện ghi nhận sự phát triển của ${positiveTasks.length} hạt giống tích cực. Điều này chứng minh rằng thực tiễn là tiêu chuẩn của chân lý và là động lực duy nhất thúc đẩy sự phát triển của nhân cách.`;

  return {
    title,
    content,
    principle,
    advice
  };
}
