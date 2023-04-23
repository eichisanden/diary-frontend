import React, { useEffect, useState } from "react";
import openai from "../../utils/openai";
import {
  TextField,
  FormControl,
  Grid,
  Card,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import cosineSimilarity from "../../utils/cosineSimilarity";

const FAQ = [
  `Q: 会社の基本情報はどこで確認できますか？
A: 会社の基本情報は、社内ポータルサイトや社内手引きに掲載されています。必要に応じて人事部にもお問い合わせください。`,
  `Q: 社員の出勤・退勤時間は何ですか？
A: 社員の出勤・退勤時間は、一般的に9:00～18:00です。ただし、部署や役職によって異なる場合がありますので、上司に確認してください。`,
  `Q: 残業手続きにはどのようなものがありますか？
A: 残業手続きは、タイムカードまたは勤怠管理システムで申請し、上司の承認を受ける必要があります。`,
  `Q: 有給休暇の取得方法は何ですか？
A: 有給休暇の取得方法は、事前に勤怠管理システムで申請し、上司の承認を受けてください。`,
  `Q: 病気休暇や育児休暇についてはどのように申請しますか？
A: 病気休暇や育児休暇の申請は、人事部に連絡し、必要書類を提出してください。`,
  `Q: 通勤手当の申請方法は何ですか？
A: 通勤手当の申請方法は、勤怠管理システムにて申請し、必要書類を人事部に提出してください。`,
  `Q: 社員の昇給・昇格評価基準はどのようになっていますか？
A: 社員の昇給・昇格評価基準は、業績評価制度に基づいて定期的に行われます。詳細は人事部にお問い合わせください。`,
  `Q: 社内での悩みや相談はどこへ持っていくべきですか？
A: 社内での悩みや相談は、上司や人事部、または社内相談窓口に相談してください。`,
  `Q: 社内の緊急連絡体制はどのようになっていますか？
A: 社内の緊急連絡体制は、電話やメール、チャットツールを使って情報が伝達されます。緊急連絡先リストは社内ポータルサイトで確認できます。`,
  `Q: 社内イベントや研修についてはどのように情報が提供されますか？
A: 社内イベントや研修情報は、社内ポータルサイトやメール、掲示板でアナウンスされます。`,
  `Q: 社員食堂の利用方法や営業時間はどのようになっていますか？
A: 社員食堂の利用方法は、食券を購入して席に着くか、社内ポータルサイトで事前予約を行ってください。営業時間は平日の11:30～14:00です。`,
  `Q: 社内の駐車場や自転車置き場はどこにありますか？
A: 社内の駐車場や自転車置き場は、建物の周囲や地下に設置されています。詳細は総務部にお問い合わせください。`,
  `Q: 社員証の紛失・破損の場合、どのように対応すべきですか？
A: 社員証の紛失・破損の場合は、速やかに総務部に連絡してください。新しい社員証が発行されます。`,
  `Q: 社内インターネットやシステムの利用方法はどこで確認できますか？
A: 社内インターネットやシステムの利用方法は、社内ポ`,
  `Q: セキュリティに関する規定や注意事項はどこで確認できますか？
A: セキュリティに関する規定や注意事項は、社内ポータルサイトやセキュリティマニュアルで確認できます。不明な点があれば、IT部門に問い合わせてください。`,
  //   `Q: 会議室の予約方法や利用ルールはどのようになっていますか？
  // A: 会議室の予約方法は、社内ポータルサイトや予約システムを利用して行ってください。利用ルールについては、各会議室に掲示されている注意事項を参照してください。`,
  //   `Q: 社員旅行や慰安旅行の手続きや日程はどのように決まりますか？
  // A: 社員旅行や慰安旅行の手続きや日程は、総務部や社内イベント委員会が決定し、社内ポータルサイトやメールで通知されます。`,
  //   `Q: 福利厚生制度の詳細はどこで確認できますか？
  // A: 福利厚生制度の詳細は、社内ポータルサイトや社内手引きで確認できます。また、人事部に問い合わせることもできます。`,
  //   `Q: 社内ネットワークのパスワード変更方法は何ですか？
  // A: 社内ネットワークのパスワード変更方法は、社内ポータルサイトやIT部門が提供するツールを利用して行ってください。`,
  //   `Q: 郵便物や宅配便の受け取り方法はどのようになっていますか？
  // A: 郵便物や宅配便の受け取り方法は、受付や総務部で受け取りが可能です。個人宛の荷物は、受け取り通知が届いたら速やかに受け取ってください。`,
  //  `Q: 社内文房具の調達方法は何ですか？
  // A: 社内文房具の調達方法は、総務部に依頼するか、社内ポータルサイトでオンライン注文ができます。`,
  //   `Q: 社員向け健康診断の日程や手続きはどのようになっていますか？
  // A: 社員向け健康診断の日程や手続きは、人事部が決定し、社内ポータルサイトやメールで通知されます。健康診断の予約や書類提出は指示に従って行ってください。`,
  //   `Q: 社内プリンターの利用方法やトラブルシューティングはどのように行いますか？
  // A: 社内プリンターの利用方法は、社内ポータルサイトやマニュアルで確認できます。トラブルシューティングは、IT部門に問い合わせて対応してもらってください。`,
  //   `Q: コピー機の利用方法やトラブルシューティングはどのように行いますか？
  // A: コピー機の利用方法は、各コピー機に掲示されている操作方法を参照してください。トラブルシューティングは、総務部やIT部門に問い合わせて対応してもらってください。`,
  //   `Q: 社員教育や研修制度についてはどのようなものがありますか？
  // A: 社員教育や研修制度については、新人研修や階層別研修、技能研修などがあります。詳細は人事部に問い合わせてください。`,
  //   `Q: 社内での誕生日や記念日のお祝いに
  // A: 社内での誕生日や記念日のお祝いは、各部署やチームで行われることが多く、ケーキやプレゼントなどでお祝いすることが一般的です。詳細は上司や同僚に相談してください。`,
  //   `Q: 社内の防災訓練や緊急時の避難方法はどのようになっていますか？
  // A: 社内の防災訓練や緊急時の避難方法は、定期的に行われる防災訓練で確認できます。避難経路や避難場所については、各フロアの掲示物を参照してください。`,
  //   `Q: 社内報や連絡事項の閲覧方法はどのようになっていますか？
  // A: 社内報や連絡事項の閲覧方法は、社内ポータルサイトやメールで確認できます。また、重要な連絡事項は社内掲示板にも掲載されます。`,
  //   `Q: 社内の各部署や役職の連絡先はどこで確認できますか？
  // A: 社内の各部署や役職の連絡先は、社内ポータルサイトや社内電話帳で確認できます。必要に応じて人事部にもお問い合わせください。`,
  //   `Q: 退職手続きや退職金に関する情報はどのように入手できますか？
  // A: 退職手続きや退職金に関する情報は、退職を検討している場合は上司に相談し、手続きについては人事部に問い合わせてください。退職金の詳細は、労働条件通知書や社内規程で確認できます。`,
];

/**
 * FAQを表示するためのコンポーネント
 */
const faqElement = FAQ.map((faq, index) => {
  return (
    <Grid xs={12}>
      <Card key={"fax" + index} sx={{ p: "auto", textAlign: "left" }}>
        <pre>{faq}</pre>
      </Card>
    </Grid>
  );
});

type EmbeddingResult = {
  faq: string;
  vector: number[];
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [faqVector, setFaqVector] = useState<EmbeddingResult[]>([]);

  // FAQをembeddingする
  useEffect(() => {
    setFaqVector([]);
    console.log("FAQをembeddingするuseEffectが呼ばれました");

    FAQ.forEach(async (faq) => {
      const result = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: faq,
      });
      const data = { faq: faq, vector: result.data.data[0].embedding };
      console.log("FAQをvector化してStateに保存する");
      console.log(data);
      setFaqVector((e) => [...e, data]);
    });
  }, FAQ);

  /**
   * Send message to OpenAI
   * @param message String to send to OpenAI
   */
  const handleMessageSubmit = async (message: string) => {
    if (!message) return;

    // clear message & result
    setMessage("");
    setResult("");

    const embeddedResult = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: message,
    });

    // vectorFaqとvectorMessageの類似度を計算する
    const similaritys = faqVector.map((data) => {
      const result = cosineSimilarity(
        data.vector,
        embeddedResult.data.data[0].embedding
      );
      return { faq: data.faq, similarity: result };
    });

    // similarityの大きい順にソートする
    const sorted = similaritys.sort((a, b) => b.similarity - a.similarity);

    // 類似度が上位3つのFAQを表示する
    const top3 = sorted.slice(0, 3);

    // top3のfaq内容を1つのstringにまとめる
    const top3Faq = top3.map((data) => data.faq).join("\n\n");

    const prompt = `
#前提データ
${top3Faq}

#質問
${message}
  `;

    setMessage(prompt);

    // createCompletion
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1000,
      temperature: 0.6,
    });

    const complitionResult = completion.data.choices[0].text ?? "";
    console.log("createCompletionの結果");
    console.log(completion.data);

    // save response to state
    setResult(complitionResult);
  };

  return (
    <Grid container>
      <Grid xs={12}>
        <Card sx={{ p: "auto", textAlign: "left" }}>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>Q</Avatar>
          <pre>{message}</pre>
        </Card>
        <Card sx={{ p: "auto", textAlign: "left" }}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar>
          <pre>{result}</pre>
        </Card>

        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            const input = e.target[0] as HTMLInputElement;
            handleMessageSubmit(input.value);
            input.value = "";
          }}
        >
          <FormControl fullWidth>
            <TextField
              id="chatText"
              variant="outlined"
              label="Send a message..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Send />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </form>
      </Grid>

      <Grid xs={12}>
        <Card sx={{ p: "auto", mt: 5, textAlign: "left" }}>■FAQ</Card>
      </Grid>
      {faqElement}
    </Grid>
  );
};

export default Chat;
