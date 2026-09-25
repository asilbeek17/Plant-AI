import json
import logging
import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

logger = logging.getLogger(__name__)

DISEASE_KNOWLEDGE_BASE = {
    "Bacterial Spot": {
        "summary": "Bacterial Spot causes small, water-soaked dark lesions on tomato leaves and fruit, especially in warm, wet conditions.",
        "treatment": [
            "Prune infected lower leaves with sanitized shears.",
            "Use a locally approved copper-based bactericide according to its label.",
            "Water at the base of the plant to prevent leaf splash.",
        ],
        "prevention": [
            "Use certified disease-free seeds and transplants.",
            "Rotate tomatoes with non-solanaceous crops.",
            "Avoid handling plants while foliage is wet.",
        ],
    },
    "Leaf Mold": {
        "summary": "Leaf Mold is a fungal disease favored by high humidity. It causes pale yellow leaf spots and olive-green growth on leaf undersides.",
        "treatment": [
            "Remove affected leaves and improve air circulation through the canopy.",
            "Reduce humidity and keep foliage dry.",
            "Use a locally approved fungicide according to its label if needed.",
        ],
        "prevention": [
            "Use drip irrigation instead of overhead watering.",
            "Space plants so leaves dry quickly.",
            "Choose leaf-mold-resistant tomato varieties when available.",
        ],
    },
    "Early Blight": {
        "summary": "Early Blight is a fungal disease that produces dark brown spots with concentric target-like rings, usually beginning on older leaves.",
        "treatment": [
            "Remove and discard severely affected lower leaves.",
            "Use an approved copper or sulfur-based fungicide according to its label.",
            "Mulch around the plant base to reduce soil splash.",
        ],
        "prevention": [
            "Maintain good spacing and airflow.",
            "Water at soil level and avoid wetting the foliage.",
            "Rotate crops and remove plant debris after harvest.",
        ],
    },
    "Late Blight": {
        "summary": "Late Blight causes large, water-soaked dark lesions on tomato leaves and stems and can spread quickly in cool, damp weather.",
        "treatment": [
            "Remove and destroy infected plant parts; do not compost them.",
            "Isolate affected plants where practical.",
            "Use an approved treatment according to its label and local agricultural guidance.",
        ],
        "prevention": [
            "Avoid overhead watering and improve canopy airflow.",
            "Inspect plants frequently during cool, wet weather.",
            "Use certified resistant varieties when available.",
        ],
    },
    "Septoria Leaf Spot": {
        "summary": "Septoria Leaf Spot causes many small circular spots with dark margins and gray centers, often moving upward from lower leaves.",
        "treatment": [
            "Remove infected lower leaves and dispose of them away from the garden.",
            "Apply an approved copper fungicide according to its label.",
            "Add mulch to reduce soil spores splashing onto foliage.",
        ],
        "prevention": [
            "Avoid working with plants while leaves are wet.",
            "Sanitize stakes, cages, and pruning tools.",
            "Rotate crops and remove infected debris.",
        ],
    },
    "Target Spot": {
        "summary": "Target Spot produces dark brown tomato leaf spots with lighter centers that can enlarge into target-like lesions.",
        "treatment": [
            "Prune affected foliage to improve airflow.",
            "Use an approved fungicide according to its label.",
            "Correct drainage and avoid prolonged leaf wetness.",
        ],
        "prevention": [
            "Remove crop residue after harvest.",
            "Maintain balanced nutrition and avoid plant stress.",
            "Keep sufficient space between plants.",
        ],
    },
    "Spider Mites Two-Spotted Spider Mite": {
        "summary": "Two-spotted spider mites feed on plant sap, causing yellow stippling and fine webbing on the undersides of leaves.",
        "treatment": [
            "Rinse the undersides of leaves with a firm stream of water.",
            "Use insecticidal soap or another locally approved treatment according to its label.",
            "Remove heavily infested leaves.",
        ],
        "prevention": [
            "Keep plants consistently watered without overwatering.",
            "Avoid excessive nitrogen fertilizer.",
            "Inspect leaf undersides regularly.",
        ],
    },
    "Tomato Yellow Leaf Curl Virus": {
        "summary": "Tomato Yellow Leaf Curl Virus causes upward leaf curling, yellow leaf margins, stunted growth, and is commonly spread by whiteflies.",
        "treatment": [
            "Remove and discard severely infected plants.",
            "Control whiteflies with approved methods and follow product labels.",
            "Isolate new plants until they have been inspected.",
        ],
        "prevention": [
            "Use virus-resistant tomato varieties.",
            "Control whiteflies and remove weed hosts.",
            "Use healthy certified planting material.",
        ],
    },
}

LOCALIZED_REPORTS = {
    "ru": {
        "Bacterial Spot": ("Бактериальная пятнистость вызывает небольшие тёмные водянистые пятна на листьях и плодах томата, особенно в тёплую влажную погоду.", ["Удалите заражённые нижние листья продезинфицированными ножницами.", "Используйте разрешённый медьсодержащий препарат строго по инструкции.", "Поливайте у основания растения, чтобы не разбрызгивать воду на листья."], ["Используйте сертифицированные здоровые семена и рассаду.", "Чередуйте томаты с культурами, не относящимися к паслёновым.", "Не работайте с растениями, когда листья мокрые."]),
        "Leaf Mold": ("Кладоспориоз — грибковая болезнь, которую провоцирует высокая влажность. На листьях появляются светло-жёлтые пятна и оливковый налёт снизу.", ["Удалите поражённые листья и улучшите циркуляцию воздуха.", "Снизьте влажность и не мочите листву.", "При необходимости используйте разрешённый фунгицид по инструкции."], ["Используйте капельный полив вместо полива сверху.", "Высаживайте растения с достаточным расстоянием.", "Выбирайте устойчивые к кладоспориозу сорта, если они доступны."]),
        "Early Blight": ("Ранняя пятнистость — грибковая болезнь с тёмными пятнами и концентрическими кольцами, обычно начинающаяся на старых листьях.", ["Удалите и выбросьте сильно поражённые нижние листья.", "Используйте разрешённый медный или серный фунгицид по инструкции.", "Замульчируйте почву вокруг основания растения."], ["Обеспечьте расстояние между растениями и хороший воздухообмен.", "Поливайте почву, не смачивая листья.", "Чередуйте культуры и убирайте растительные остатки после урожая."]),
        "Late Blight": ("Фитофтороз вызывает крупные водянистые тёмные пятна на листьях и стеблях томата и быстро распространяется в прохладную влажную погоду.", ["Удалите и уничтожьте заражённые части, не добавляйте их в компост.", "По возможности изолируйте поражённые растения.", "Используйте разрешённое средство по инструкции и местным рекомендациям."], ["Не поливайте сверху и улучшите воздухообмен.", "Чаще осматривайте растения в прохладную влажную погоду.", "Выбирайте устойчивые сорта, если они доступны."]),
        "Septoria Leaf Spot": ("Септориоз вызывает множество мелких круглых пятен с тёмными краями и серыми центрами, часто поднимаясь от нижних листьев.", ["Удалите нижние заражённые листья и выбросьте их вдали от сада.", "Применяйте разрешённый медный фунгицид по инструкции.", "Добавьте мульчу, чтобы споры из почвы не попадали на листья."], ["Не работайте с растениями, пока листья мокрые.", "Дезинфицируйте опоры, каркасы и инструменты.", "Чередуйте культуры и убирайте заражённые остатки."]),
        "Target Spot": ("Альтернариозная мишеневидная пятнистость образует тёмно-коричневые пятна со светлыми центрами.", ["Обрежьте поражённую листву для улучшения воздухообмена.", "Используйте разрешённый фунгицид по инструкции.", "Улучшите дренаж и избегайте длительной влажности листьев."], ["Убирайте растительные остатки после урожая.", "Поддерживайте сбалансированное питание и не допускайте стресса растений.", "Оставляйте достаточно места между растениями."]),
        "Spider Mites Two-Spotted Spider Mite": ("Паутинные клещи питаются соком растения, вызывая жёлтую крапчатость и тонкую паутину на нижней стороне листьев.", ["Промойте нижнюю сторону листьев сильной струёй воды.", "Используйте инсектицидное мыло или разрешённое средство по инструкции.", "Удалите сильно поражённые листья."], ["Регулярно поливайте растения, не переувлажняя их.", "Не используйте чрезмерное количество азотных удобрений.", "Регулярно осматривайте нижнюю сторону листьев."]),
        "Tomato Yellow Leaf Curl Virus": ("Вирус жёлтой курчавости листьев томата вызывает скручивание, пожелтение краёв, задержку роста и часто распространяется белокрылкой.", ["Удалите и выбросьте сильно заражённые растения.", "Контролируйте белокрылку разрешёнными методами по инструкции.", "Изолируйте новые растения до завершения осмотра."], ["Используйте устойчивые к вирусу сорта.", "Контролируйте белокрылку и удаляйте сорняки-хозяева.", "Используйте здоровый сертифицированный посадочный материал."]),
    },
    "uz": {
        "Bacterial Spot": ("Bakterial dog‘lanish pomidor barglari va mevalarida, ayniqsa iliq va nam sharoitda, mayda to‘q suvli dog‘larni keltirib chiqaradi.", ["Zararlangan pastki barglarni dezinfeksiya qilingan qaychi bilan olib tashlang.", "Yorliqdagi ko‘rsatmaga muvofiq ruxsat etilgan misli preparatdan foydalaning.", "Barglarga suv sachramasligi uchun o‘simlik tagidan sug‘oring."], ["Sertifikatlangan sog‘lom urug‘ va ko‘chatlardan foydalaning.", "Pomidorni ituzumdosh bo‘lmagan ekinlar bilan navbatlab eking.", "Barglar ho‘l bo‘lganda o‘simlikka tegmang."]),
        "Leaf Mold": ("Barg mog‘ori yuqori namlikni yoqtiradigan zamburug‘ kasalligidir. Barglarda och sariq dog‘lar va pastki tomonda zaytun rangli qoplama paydo bo‘ladi.", ["Zararlangan barglarni olib tashlang va havo aylanishini yaxshilang.", "Namlikni kamaytiring va barglarni quruq tuting.", "Zarur bo‘lsa, yorliq bo‘yicha ruxsat etilgan fungitsiddan foydalaning."], ["Ustidan sug‘orish o‘rniga tomchilatib sug‘oring.", "Barglar tez qurishi uchun o‘simliklar orasida masofa qoldiring.", "Imkon bo‘lsa, barg mog‘origa chidamli navlarni tanlang."]),
        "Early Blight": ("Erta kuyish — odatda eski barglardan boshlanadigan, to‘q jigarrang va halqasimon dog‘lar hosil qiluvchi zamburug‘ kasalligidir.", ["Kuchli zararlangan pastki barglarni olib tashlab tashlang.", "Yorliq bo‘yicha ruxsat etilgan misli yoki oltingugurtli fungitsiddan foydalaning.", "O‘simlik tagidagi tuproqni mulchalang."], ["O‘simliklar orasida masofa va yaxshi havo aylanishini ta’minlang.", "Barglarni ho‘llamasdan tuproq sathidan sug‘oring.", "Ekinlarni navbatlab eking va hosildan keyin qoldiqlarni olib tashlang."]),
        "Late Blight": ("Kech kuyish pomidor barglari va poyalarida katta suvli to‘q dog‘lar hosil qiladi va salqin, nam havoda tez tarqaladi.", ["Zararlangan qismlarni olib tashlab yo‘q qiling, kompostga solmang.", "Imkon bo‘lsa, zararlangan o‘simliklarni ajrating.", "Yorliq va mahalliy qishloq xo‘jaligi tavsiyalariga muvofiq ruxsat etilgan vositadan foydalaning."], ["Ustidan sug‘ormang va o‘simlik tojida havo aylanishini yaxshilang.", "Salqin va nam havoda o‘simliklarni tez-tez tekshiring.", "Imkon bo‘lsa, chidamli navlardan foydalaning."]),
        "Septoria Leaf Spot": ("Septorioz pastki barglardan yuqoriga tarqaluvchi, to‘q chetli va kulrang markazli ko‘plab mayda dumaloq dog‘larni hosil qiladi.", ["Zararlangan pastki barglarni olib tashlab, bog‘dan uzoqqa tashlang.", "Yorliq bo‘yicha ruxsat etilgan misli fungitsidni qo‘llang.", "Tuproq sporalarining bargga sachramasligi uchun mulch qo‘shing."], ["Barglar ho‘l bo‘lganda o‘simlik bilan ishlamang.", "Tayanchlar va kesish asboblarini dezinfeksiya qiling.", "Ekinlarni navbatlab eking va zararlangan qoldiqlarni olib tashlang."]),
        "Target Spot": ("Nishon dog‘lanishi markazi ochroq bo‘lgan to‘q jigarrang pomidor barg dog‘larini hosil qiladi.", ["Havo aylanishini yaxshilash uchun zararlangan barglarni kesing.", "Yorliq bo‘yicha ruxsat etilgan fungitsiddan foydalaning.", "Drenajni yaxshilang va barglar uzoq vaqt nam qolishiga yo‘l qo‘ymang."], ["Hosildan keyin ekin qoldiqlarini olib tashlang.", "Oziqlanishni muvozanatlang va o‘simlik stressini kamaytiring.", "O‘simliklar orasida yetarli masofa qoldiring."]),
        "Spider Mites Two-Spotted Spider Mite": ("O‘rgimchakkana o‘simlik sharbatini so‘rib, barglarning pastki tomonida sariq nuqtalar va mayda to‘rlar hosil qiladi.", ["Barglarning pastki tomonini kuchli suv oqimi bilan yuving.", "Yorliq bo‘yicha insektitsid sovuni yoki ruxsat etilgan vositadan foydalaning.", "Kuchli zararlangan barglarni olib tashlang."], ["O‘simliklarni ortiqcha sug‘ormasdan muntazam namlang.", "Azotli o‘g‘itni haddan tashqari ko‘p ishlatmang.", "Barglarning pastki tomonini muntazam tekshiring."]),
        "Tomato Yellow Leaf Curl Virus": ("Pomidor sariq barg buralishi virusi barglarning yuqoriga buralishi, chetlarining sarg‘ayishi va o‘sishning sekinlashishiga sabab bo‘ladi; u ko‘pincha oqkanot orqali tarqaladi.", ["Kuchli zararlangan o‘simliklarni olib tashlab tashlang.", "Oqkanotni yorliq bo‘yicha ruxsat etilgan usullar bilan nazorat qiling.", "Yangi o‘simliklarni tekshirilguncha ajratib turing."], ["Virusga chidamli pomidor navlaridan foydalaning.", "Oqkanot va begona o‘t-xo‘jayinlarni nazorat qiling.", "Sog‘lom sertifikatlangan ekish materialidan foydalaning."]),
    },
}

LOCALIZED_REPORTS["ko"] = {
    "Bacterial Spot": ("세균성 반점병은 따뜻하고 습한 환경에서 토마토 잎과 열매에 작고 어두운 물먹은 반점을 만듭니다.", ["소독한 가위로 감염된 아래쪽 잎을 제거하세요.", "제품 설명에 따라 허가된 구리계 살균제를 사용하세요.", "잎에 물이 튀지 않도록 식물 밑동에 물을 주세요."], ["인증된 무병 종자와 모종을 사용하세요.", "토마토를 가지과가 아닌 작물과 돌려짓기하세요.", "잎이 젖어 있을 때 식물을 만지지 마세요."]),
    "Leaf Mold": ("잎곰팡이병은 높은 습도에서 잘 발생하는 곰팡이병입니다. 잎에 연한 노란 반점과 잎 뒷면의 올리브색 곰팡이가 나타납니다.", ["영향을 받은 잎을 제거하고 잎 사이의 통풍을 개선하세요.", "습도를 낮추고 잎을 건조하게 유지하세요.", "필요하면 제품 설명에 따라 허가된 살균제를 사용하세요."], ["위에서 물을 주는 대신 점적 관수를 사용하세요.", "잎이 빨리 마르도록 식물 사이에 충분한 간격을 두세요.", "가능하면 잎곰팡이병 저항성 토마토 품종을 선택하세요."]),
    "Early Blight": ("겹둥근무늬병은 주로 오래된 잎에서 시작되며 동심원 모양의 짙은 갈색 반점을 만드는 곰팡이병입니다.", ["심하게 감염된 아래쪽 잎을 제거해 버리세요.", "제품 설명에 따라 허가된 구리계 또는 유황계 살균제를 사용하세요.", "흙이 잎에 튀지 않도록 식물 밑동 주변을 덮으세요."], ["식물 사이의 간격과 통풍을 확보하세요.", "잎을 적시지 말고 흙 표면에 물을 주세요.", "작물을 돌려짓고 수확 후 식물 잔해를 제거하세요."]),
    "Late Blight": ("역병은 토마토 잎과 줄기에 크고 물먹은 어두운 병반을 만들며 서늘하고 습한 날씨에 빠르게 퍼질 수 있습니다.", ["감염된 부분을 제거해 폐기하고 퇴비로 만들지 마세요.", "가능하면 영향을 받은 식물을 격리하세요.", "제품 설명과 현지 농업 지침에 따라 허가된 방제제를 사용하세요."], ["위에서 물을 주지 말고 잎 사이의 통풍을 개선하세요.", "서늘하고 습한 날씨에는 식물을 자주 확인하세요.", "가능하면 저항성 품종을 사용하세요."]),
    "Septoria Leaf Spot": ("셉토리아 잎반점은 아래쪽 잎에서 위로 퍼지며 어두운 가장자리와 회색 중심을 가진 작은 원형 반점을 많이 만듭니다.", ["감염된 아래쪽 잎을 제거해 정원에서 멀리 폐기하세요.", "제품 설명에 따라 허가된 구리계 살균제를 사용하세요.", "흙의 포자가 잎에 튀지 않도록 덮개를 사용하세요."], ["잎이 젖어 있을 때 작업하지 마세요.", "지지대와 전정 도구를 소독하세요.", "작물을 돌려짓고 감염된 잔해를 제거하세요."]),
    "Target Spot": ("겹둥근무늬 반점병은 중심이 더 밝은 짙은 갈색 토마토 잎 반점을 만듭니다.", ["통풍을 개선하도록 영향을 받은 잎을 가지치기하세요.", "제품 설명에 따라 허가된 살균제를 사용하세요.", "배수를 개선하고 잎이 오래 젖어 있지 않도록 하세요."], ["수확 후 작물 잔해를 제거하세요.", "균형 잡힌 영양을 유지하고 식물 스트레스를 줄이세요.", "식물 사이에 충분한 간격을 두세요."]),
    "Spider Mites Two-Spotted Spider Mite": ("점박이응애는 식물의 즙을 빨아 잎 뒷면에 노란 반점과 가는 거미줄을 만듭니다.", ["잎 뒷면을 강한 물줄기로 씻어내세요.", "제품 설명에 따라 살충 비누나 허가된 방제제를 사용하세요.", "심하게 감염된 잎을 제거하세요."], ["과도한 물주기를 피하면서 식물에 꾸준히 물을 주세요.", "질소 비료를 과도하게 사용하지 마세요.", "잎 뒷면을 정기적으로 확인하세요."]),
    "Tomato Yellow Leaf Curl Virus": ("토마토황화잎말림바이러스는 잎 말림, 잎 가장자리 황화와 생육 저하를 일으키며 주로 담배가루이에 의해 퍼집니다.", ["심하게 감염된 식물을 제거해 폐기하세요.", "제품 설명에 따라 허가된 방법으로 담배가루이를 관리하세요.", "새 식물은 확인할 때까지 격리하세요."], ["바이러스 저항성 토마토 품종을 사용하세요.", "담배가루이와 잡초 기주를 관리하세요.", "건강하고 인증된 재식 재료를 사용하세요."]),
}

LOCALIZED_DISEASE_NAMES = {
    "ru": {
        "Bacterial Spot": "Бактериальная пятнистость",
        "Leaf Mold": "Кладоспориоз",
        "Early Blight": "Ранняя пятнистость",
        "Late Blight": "Фитофтороз",
        "Septoria Leaf Spot": "Септориоз",
        "Target Spot": "Мишеневидная пятнистость",
        "Spider Mites Two-Spotted Spider Mite": "Паутинный клещ",
        "Tomato Yellow Leaf Curl Virus": "Вирус жёлтой курчавости листьев томата",
        "Healthy": "Здоровое растение",
    },
    "uz": {
        "Bacterial Spot": "Bakterial dog‘lanish",
        "Leaf Mold": "Barg mog‘ori",
        "Early Blight": "Erta kuyish",
        "Late Blight": "Kech kuyish",
        "Septoria Leaf Spot": "Septorioz",
        "Target Spot": "Nishon dog‘lanishi",
        "Spider Mites Two-Spotted Spider Mite": "O‘rgimchakkana",
        "Tomato Yellow Leaf Curl Virus": "Pomidor sariq barg buralishi virusi",
        "Healthy": "Sog‘lom o‘simlik",
    },
    "ko": {
        "Bacterial Spot": "세균성 반점병",
        "Leaf Mold": "토마토 잎곰팡이병",
        "Early Blight": "겹둥근무늬병",
        "Late Blight": "역병",
        "Septoria Leaf Spot": "셉토리아 잎반점",
        "Target Spot": "겹둥근무늬 반점병",
        "Spider Mites Two-Spotted Spider Mite": "점박이응애",
        "Tomato Yellow Leaf Curl Virus": "토마토황화잎말림바이러스",
        "Healthy": "건강한 식물",
    },
}


@dataclass
class DiagnosisResult:
    plant_name: str
    disease: str
    confidence: float
    treatment: str
    prevention: str
    provider: str


@lru_cache(maxsize=1)
def _load_local_tomato_model():
    try:
        import torch
        from torchvision import models, transforms
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The local tomato model dependencies are not installed. Run pip install torch torchvision."
        ) from exc

    project_root = Path(__file__).resolve().parent.parent
    model_dir = project_root / "Tomato-classfier"
    model_path = model_dir / "plant_disease_model.pth"
    mapping_path = model_dir / "class_mapping.json"

    if not model_path.exists() or not mapping_path.exists():
        raise RuntimeError(
            "The local tomato model files were not found in the Tomato-classfier folder."
        )

    with mapping_path.open("r", encoding="utf-8") as file:
        idx_to_class = json.load(file)
    idx_to_class = {int(key): value for key, value in idx_to_class.items()}

    model = models.resnet34(weights=None)
    model.fc = torch.nn.Sequential(
        torch.nn.Dropout(0.3),
        torch.nn.Linear(model.fc.in_features, len(idx_to_class)),
    )

    state_dict = torch.load(model_path, map_location="cpu", weights_only=True)
    model.load_state_dict(state_dict)
    model.eval()

    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return model, idx_to_class, transform


def _clean_local_disease_name(raw_name: str) -> str:
    cleaned = raw_name.replace("___", " ").replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = cleaned.replace("Tomato ", "", 1)
    if cleaned.lower() == "healthy":
        return "Healthy"
    return cleaned.title() if cleaned and cleaned[0].isalpha() else cleaned


def _disease_report(disease: str, language: str = "en") -> tuple[str, str, str]:
    if disease == "Healthy":
        healthy = {
            "ru": ("Модель не обнаружила видимых признаков болезней томатов, для распознавания которых она обучена.", "Для этого анализа лечение не требуется. Продолжайте обычный полив и наблюдайте за растением.", "Поддерживайте расстояние между растениями, воздухообмен, чистые инструменты и регулярный осмотр."),
            "uz": ("Model o‘zi aniqlashga o‘rgatilgan pomidor kasalliklarining ko‘rinadigan belgilarini topmadi.", "Bu tahlil bo‘yicha davolash kerak emas. Odatdagi sug‘orishni davom ettiring va o‘simlikni kuzating.", "Yetarli masofa va havo aylanishini saqlang, asboblarni toza tuting va muntazam tekshiring."),
            "ko": ("모델이 학습한 토마토 질병의 눈에 보이는 징후가 발견되지 않았습니다.", "이번 분석에서는 질병 치료가 필요하지 않습니다. 평소처럼 물을 주고 식물을 관찰하세요.", "식물 사이의 간격과 통풍을 유지하고 도구를 깨끗하게 관리하며 정기적으로 확인하세요."),
        }
        return healthy.get(language, (
            "The model found no visible signs of the tomato diseases it was trained to recognize.",
            "No disease treatment is indicated by this scan. Continue normal watering and monitor the plant.",
            "Maintain good spacing, airflow, clean tools, and regular inspections.",
        ))

    localized = LOCALIZED_REPORTS.get(language, {}).get(disease)
    if localized:
        summary, treatment, prevention = localized
        return summary, "\n".join(f"• {step}" for step in treatment), "\n".join(f"• {tip}" for tip in prevention)
    info = DISEASE_KNOWLEDGE_BASE.get(disease)
    if not info:
        return (
            f"The local model identified {disease} in the uploaded tomato image.",
            "Remove severely affected leaves, improve airflow, keep foliage dry, and follow local agricultural guidance.",
            "Use clean planting material, water at soil level, and remove plant debris.",
        )

    return (
        info["summary"],
        "\n".join(f"• {step}" for step in info["treatment"]),
        "\n".join(f"• {tip}" for tip in info["prevention"]),
    )


def _localized_disease_name(disease: str, language: str) -> str:
    return LOCALIZED_DISEASE_NAMES.get(language, {}).get(disease, disease)


def _localized_plant_name(language: str) -> str:
    return {"ru": "Томат", "uz": "Pomidor", "ko": "토마토"}.get(language, "Tomato")


def _predict_with_local_tomato_model(image_path: str, language: str = "en") -> DiagnosisResult:
    try:
        import torch
        from PIL import Image
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The local tomato model dependencies are not installed. Run pip install torch torchvision."
        ) from exc

    model, idx_to_class, transform = _load_local_tomato_model()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)

    with torch.inference_mode():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    results = [
        {"class": idx_to_class[index], "confidence": float(probability.item())}
        for index, probability in enumerate(probabilities)
    ]
    results.sort(key=lambda item: item["confidence"], reverse=True)

    top = results[0]
    disease = _clean_local_disease_name(top["class"])
    confidence = max(0.0, min(1.0, float(top["confidence"])))
    summary, treatment, prevention = _disease_report(disease, language)

    return DiagnosisResult(
        plant_name=_localized_plant_name(language),
        disease=_localized_disease_name(disease, language),
        confidence=confidence,
        treatment=f"{summary}\n\nTreatment:\n{treatment}",
        prevention=prevention,
        provider="local_tomato_model",
    )


def analyze_plant_image(image_path: str, language: str = "en") -> DiagnosisResult:
    try:
        return _predict_with_local_tomato_model(image_path, language)
    except RuntimeError:
        raise
    except Exception as exc:
        logger.exception("Local tomato model analysis failed: %s", exc)
        raise RuntimeError("The local tomato disease model could not analyze this image.") from exc
