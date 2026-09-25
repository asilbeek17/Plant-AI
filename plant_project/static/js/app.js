(() => {
    const state = { files: [], currentDiagnosisId: null, diagnoses: [], plants: [], user: null, profile: null, preferences: null, authMode: 'login', typingTimer: null };
    let renderRegionalWatch = null;
    const translations = {
        en: {
            workspace: 'Workspace', dashboard: 'Dashboard', history: 'History', account: 'Account', profile: 'My profile', settings: 'Settings',
            helpTitle: 'Need a little help?', helpText: 'Learn how to take the best plant photos.', photoTips: 'View photo tips →',
            signIn: 'Sign in', signOut: 'Sign out', guest: 'Guest user', signInSave: 'Sign in to save scans', plantEnthusiast: 'Plant enthusiast',
            date: 'THURSDAY, SEPTEMBER 24, 2026', goodMorning: 'Good morning,', there: '', welcome: 'Let’s keep your plants happy and healthy.', newScan: '＋ New scan',
            checkup: 'PLANT CHECKUP', checkupQuestion: 'What’s going on with your plant?', dropPhotos: 'Drop your plant photos here', or: 'or', browse: 'browse from your device',
            fileHelp: 'JPG, PNG or WEBP · max 10 MB each · up to 5 photos', private: 'Your photos stay private', analyze: 'Analyze plant →',
            yourPlants: 'YOUR PLANTS', recent: 'Recent checkups', viewAll: 'View all →', currentInsight: 'CURRENT INSIGHT', noScan: 'No plant scanned yet',
            waiting: 'Waiting', report: 'Your plant’s health report<br>will show up here.', uploadHelp: 'Upload a clear photo of a leaf or stem to get started.',
            viewReport: 'View full report →', ask: 'Ask PlantCare', aiAdvice: 'AI-powered plant advice', chatHelp: 'Ask me anything about your plant<br>after an analysis.',
            chatPlaceholder: 'Ask a follow-up question…', activity: 'YOUR ACTIVITY', historyTitle: 'Checkup history', historySubtitle: 'A timeline of every plant you have checked.',
            allResults: 'All results', healthyPlants: 'Healthy plants', needsAttention: 'Needs attention', noHistory: 'No checkups yet', historyHelp: 'Your completed plant scans will be saved here.',
            noMatches: 'No matching checkups', tryAgain: 'Try a different search or complete a new scan.', accountLabel: 'ACCOUNT', profileTitle: 'My profile',
            profileSubtitle: 'Manage your personal information and preferences.', about: 'ABOUT YOU', preferences: 'Plant care preferences',
            experience: 'Growing experience', favorites: 'Favorite plants', location: 'Location', notSet: 'Not set', editProfile: 'Edit profile',
            guestProfile: 'Create an account to keep your plant history.', scans: 'Scans', savedPlants: 'Saved plants', healthy: 'Plants healthy',
            preferenceLabel: 'PREFERENCES', settingsTitle: 'Settings', settingsSubtitle: 'Make PlantCare work the way you like.', general: 'GENERAL',
            emailUpdates: 'Email updates', emailUpdatesHelp: 'Receive occasional plant care reminders.', autoSave: 'Auto-save checkups',
            autoSaveHelp: 'Keep a record of every completed analysis.', appearance: 'APPEARANCE', compactCards: 'Use compact cards',
            compactCardsHelp: 'Show more history items on screen.', interfaceLanguage: 'Interface language', languageHelp: 'Choose the language for PlantCare AI.',
            authLabel: 'PLANTCARE ACCOUNT', welcomeBack: 'Welcome back', signInHelp: 'Sign in to save your scans and access them anywhere.',
            createAccount: 'Create your account', createHelp: 'Save your plant history and access it anywhere.', firstName: 'First name', lastName: 'Last name',
            email: 'Email', username: 'Username', password: 'Password', create: 'Create account', needAccount: 'Need an account? Create one', alreadyAccount: 'Already have an account? Sign in',
            profileEdit: 'Edit profile', profileHelp: 'Update your plant-care preferences and personal details.', save: 'Save profile',
            tipsLabel: 'PHOTO TIPS', tipsTitle: 'Get a better diagnosis', tipsHelp: 'Clear, well-lit photos help PlantCare AI spot issues more accurately.',
            tip1: 'Photograph the affected leaf up close.', tip2: 'Use natural light and avoid harsh shadows.', tip3: 'Include the whole plant when possible.',
            saved: 'Profile saved.', preferenceSaved: 'Preference saved.', signedOut: 'You have been signed out.', savedConversation: 'SAVED CONVERSATION', noConversation: 'No saved messages for this checkup.', thinking: 'PlantCare is thinking', thinkingReview: 'Reviewing your plant context', thinkingPrepare: 'Preparing helpful guidance',
            scan: 'Scan', archive: 'Archive', language: 'Language', countryExamples: 'COUNTRY EXAMPLES', action: 'Action:', demoCountry: 'Demo country', diseaseExample: 'Tomato disease example', demoSignal: 'Sample educational content for the product demo.', demoAction: 'Check the plant and follow local guidance.',
            tomatoStudio: 'TOMATO HEALTH STUDIO', localDiagnosis: 'Local visual diagnosis', introDiagnosis: 'Local visual<br>diagnosis', newObservation: 'NEW OBSERVATION', fileTypes: 'JPG / PNG / WEBP', stepPhoto: 'STEP ONE · ADD A PHOTO', uploadQuestion: 'What is your plant<br>trying to tell you?', captureHelp: 'Photograph the affected tomato leaf in natural light. Keep the leaf flat, close, and in focus.', dropPhoto: 'Drop your photo here', selectDevice: 'select from device', maxFile: 'Maximum 10 MB · one image gives the clearest reading', privateDesign: 'Private by design', readPlant: 'Read this plant', fieldNote: 'FIELD NOTE', observationLives: 'Your observation<br>will live here.', modelReturns: 'Once you add a photograph, the local tomato model will return the condition and next steps.', modelReading: 'MODEL READING', observation: 'Observation', doNow: 'What to do now', keepHealthy: 'Keep it healthy', anotherObservation: '＋ Make another observation', agroverseNote: 'AGROVERSE NOTE', modelDisclaimer: 'This model is trained for tomato plant diseases. Results are guidance, not a replacement for a local agronomist.',
            lookCloser: 'Look closer.', growSmarter: 'Grow smarter', match: 'match', yourFieldNotes: 'YOUR FIELD NOTES', archiveTitle: 'Observation archive', archiveSubtitle: 'A quiet record of every plant you have checked.', newObservationButton: '＋ New observation', searchArchive: 'Search the archive…', allObservations: 'All observations', completedAppear: 'Completed observations will appear here.', profileGrowing: 'YOUR GROWING PROFILE', aboutGrower: 'About the grower', growingSubtitle: 'Keep your growing context close to your observations.', notes: 'Notes', plants: 'Plants', healthyLabel: 'Healthy', growingContext: 'GROWING CONTEXT', yourPreferences: 'Your preferences', createAccountProfile: 'Create an account to keep your field notes.', studioPreferences: 'STUDIO PREFERENCES', makeYours: 'Make it yours', makeYoursSubtitle: 'Tune the experience around the way you care for plants.', display: 'DISPLAY', photoGuide: 'Photo guide', savedNote: 'SAVED NOTE', yourProfile: 'YOUR PROFILE', editGrowingProfile: 'Edit growing profile', updateGrowing: 'Update your personal information and growing context.', growingExperience: 'Growing experience', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', favoritePlants: 'Favorite plants', close: 'Close', agroverseAccount: 'AGROVERSE ACCOUNT', photoGuideTitle: 'Make a useful field note', photoGuideText: 'Clear, well-lit photographs help the local model read the leaf more consistently.', photoTip1: 'Photograph the affected leaf up close.', photoTip2: 'Use natural light and avoid harsh shadows.', photoTip3: 'Include the whole plant when possible.', unknownPlant: 'Unknown plant', analysisComplete: 'Analysis complete', plantCheckup: 'Plant checkup', onlyImages: 'Only image files under 10 MB can be added.', maxPhotos: 'You can analyze up to 5 photos at a time.', profileLoading: 'Profile data is still loading.', accountCreated: 'Account created.', welcomeBackToast: 'Welcome back.', signInPreferences: 'Sign in to save preferences.'
        },
        ru: {
            workspace: 'Рабочая область', dashboard: 'Панель', history: 'История', account: 'Аккаунт', profile: 'Мой профиль', settings: 'Настройки',
            helpTitle: 'Нужна помощь?', helpText: 'Узнайте, как делать лучшие фотографии растений.', photoTips: 'Советы по фото →',
            signIn: 'Войти', signOut: 'Выйти', guest: 'Гость', signInSave: 'Войдите, чтобы сохранять анализы', plantEnthusiast: 'Любитель растений',
            date: 'ЧЕТВЕРГ, 24 СЕНТЯБРЯ 2026', goodMorning: 'Доброе утро,', there: '', welcome: 'Давайте заботиться о ваших растениях.', newScan: '＋ Новый анализ',
            checkup: 'ПРОВЕРКА РАСТЕНИЯ', checkupQuestion: 'Что происходит с вашим растением?', dropPhotos: 'Перетащите фото растения сюда', or: 'или', browse: 'выберите на устройстве',
            fileHelp: 'JPG, PNG или WEBP · до 10 МБ · до 5 фото', private: 'Ваши фото остаются приватными', analyze: 'Анализировать →',
            yourPlants: 'ВАШИ РАСТЕНИЯ', recent: 'Последние проверки', viewAll: 'Все →', currentInsight: 'ТЕКУЩИЙ РЕЗУЛЬТАТ', noScan: 'Растение ещё не проверено',
            waiting: 'Ожидание', report: 'Отчёт о здоровье растения<br>появится здесь.', uploadHelp: 'Загрузите чёткое фото листа или стебля.',
            viewReport: 'Открыть полный отчёт →', ask: 'Спросить PlantCare', aiAdvice: 'Советы от ИИ', chatHelp: 'Задайте вопрос о растении<br>после анализа.',
            chatPlaceholder: 'Задайте дополнительный вопрос…', activity: 'ВАША АКТИВНОСТЬ', historyTitle: 'История проверок', historySubtitle: 'История всех проверенных растений.',
            allResults: 'Все результаты', healthyPlants: 'Здоровые растения', needsAttention: 'Требуют внимания', noHistory: 'Проверок пока нет', historyHelp: 'Завершённые анализы появятся здесь.',
            noMatches: 'Совпадений нет', tryAgain: 'Измените поиск или выполните новый анализ.', accountLabel: 'АККАУНТ', profileTitle: 'Мой профиль',
            profileSubtitle: 'Управляйте личными данными и настройками.', about: 'О ВАС', preferences: 'Предпочтения ухода',
            experience: 'Опыт выращивания', favorites: 'Любимые растения', location: 'Местоположение', notSet: 'Не указано', editProfile: 'Изменить профиль',
            guestProfile: 'Создайте аккаунт, чтобы сохранять историю.', scans: 'Анализы', savedPlants: 'Сохранённые растения', healthy: 'Здоровые',
            preferenceLabel: 'ПРЕДПОЧТЕНИЯ', settingsTitle: 'Настройки', settingsSubtitle: 'Настройте PlantCare под себя.', general: 'ОБЩИЕ',
            emailUpdates: 'Обновления по email', emailUpdatesHelp: 'Получайте напоминания об уходе.', autoSave: 'Автосохранение анализов',
            autoSaveHelp: 'Сохранять каждый завершённый анализ.', appearance: 'ВИД', compactCards: 'Компактные карточки',
            compactCardsHelp: 'Показывать больше истории на экране.', interfaceLanguage: 'Язык интерфейса', languageHelp: 'Выберите язык PlantCare AI.',
            authLabel: 'АККАУНТ PLANTCARE', welcomeBack: 'С возвращением', signInHelp: 'Войдите, чтобы сохранять анализы.',
            createAccount: 'Создать аккаунт', createHelp: 'Сохраняйте историю растений и открывайте её везде.', firstName: 'Имя', lastName: 'Фамилия',
            email: 'Email', username: 'Имя пользователя', password: 'Пароль', create: 'Создать аккаунт', needAccount: 'Нет аккаунта? Создать', alreadyAccount: 'Уже есть аккаунт? Войти',
            profileEdit: 'Изменить профиль', profileHelp: 'Обновите данные и предпочтения ухода.', save: 'Сохранить профиль',
            tipsLabel: 'СОВЕТЫ ПО ФОТО', tipsTitle: 'Как улучшить анализ', tipsHelp: 'Чёткие фотографии при хорошем освещении помогают точнее найти проблемы.',
            tip1: 'Снимайте повреждённый лист крупным планом.', tip2: 'Используйте естественный свет без резких теней.', tip3: 'По возможности покажите всё растение.',
            saved: 'Профиль сохранён.', preferenceSaved: 'Настройка сохранена.', signedOut: 'Вы вышли из аккаунта.', savedConversation: 'СОХРАНЁННАЯ ЗАПИСЬ', noConversation: 'Для этой проверки нет сохранённых сообщений.', thinking: 'PlantCare думает', thinkingReview: 'Проверяем контекст растения', thinkingPrepare: 'Готовим полезный совет',
            scan: 'Сканирование', archive: 'Архив', language: 'Язык', countryExamples: 'ПРИМЕРЫ ПО СТРАНАМ', action: 'Действие:', demoCountry: 'Демонстрационная страна', diseaseExample: 'Пример болезни томатов', demoSignal: 'Пример образовательного материала для демонстрации.', demoAction: 'Проверьте растение и следуйте местным рекомендациям.',
            tomatoStudio: 'СТУДИЯ ЗДОРОВЬЯ ТОМАТОВ', localDiagnosis: 'Локальная визуальная диагностика', introDiagnosis: 'Локальная визуальная<br>диагностика', newObservation: 'НОВОЕ НАБЛЮДЕНИЕ', fileTypes: 'JPG / PNG / WEBP', stepPhoto: 'ШАГ ПЕРВЫЙ · ДОБАВЬТЕ ФОТО', uploadQuestion: 'Что ваше растение<br>пытается вам сказать?', captureHelp: 'Сфотографируйте поражённый лист томата при естественном освещении. Лист должен быть плоским, крупным и в фокусе.', dropPhoto: 'Перетащите фото сюда', selectDevice: 'выберите на устройстве', maxFile: 'Максимум 10 МБ · одно фото даёт самый точный результат', privateDesign: 'Конфиденциальность прежде всего', readPlant: 'Прочитать состояние растения', fieldNote: 'ПОЛЕВАЯ ЗАПИСЬ', observationLives: 'Ваше наблюдение<br>появится здесь.', modelReturns: 'После добавления фото локальная модель томатов покажет состояние растения и следующие шаги.', modelReading: 'РЕЗУЛЬТАТ МОДЕЛИ', observation: 'Наблюдение', doNow: 'Что сделать сейчас', keepHealthy: 'Как сохранить здоровье', anotherObservation: '＋ Новое наблюдение', agroverseNote: 'ЗАМЕТКА AGROVERSE', modelDisclaimer: 'Модель обучена определять болезни томатов. Результат является рекомендацией и не заменяет местного агронома.',
            lookCloser: 'Посмотрите внимательнее.', growSmarter: 'Выращивайте эффективнее', match: 'совпадение', yourFieldNotes: 'ВАШИ ПОЛЕВЫЕ ЗАПИСИ', archiveTitle: 'Архив наблюдений', archiveSubtitle: 'Спокойная история всех проверенных вами растений.', newObservationButton: '＋ Новое наблюдение', searchArchive: 'Поиск в архиве…', allObservations: 'Все наблюдения', completedAppear: 'Завершённые наблюдения появятся здесь.', profileGrowing: 'ВАШ ПРОФИЛЬ ВЫРАЩИВАТЕЛЯ', aboutGrower: 'О выращивателе', growingSubtitle: 'Храните контекст выращивания рядом с наблюдениями.', notes: 'Записи', plants: 'Растения', healthyLabel: 'Здоровые', growingContext: 'КОНТЕКСТ ВЫРАЩИВАНИЯ', yourPreferences: 'Ваши предпочтения', createAccountProfile: 'Создайте аккаунт, чтобы хранить полевые записи.', studioPreferences: 'НАСТРОЙКИ СТУДИИ', makeYours: 'Настройте под себя', makeYoursSubtitle: 'Настройте интерфейс под свой уход за растениями.', display: 'ОТОБРАЖЕНИЕ', photoGuide: 'Гид по фото', savedNote: 'СОХРАНЁННАЯ ЗАПИСЬ', yourProfile: 'ВАШ ПРОФИЛЬ', editGrowingProfile: 'Изменить профиль выращивателя', updateGrowing: 'Обновите личные данные и контекст выращивания.', growingExperience: 'Опыт выращивания', beginner: 'Начинающий', intermediate: 'Средний', advanced: 'Продвинутый', favoritePlants: 'Любимые растения', close: 'Закрыть', agroverseAccount: 'АККАУНТ AGROVERSE', photoGuideTitle: 'Как сделать полезную полевую запись', photoGuideText: 'Чёткие фотографии при хорошем освещении помогают локальной модели точнее оценить лист.', photoTip1: 'Снимайте поражённый лист крупным планом.', photoTip2: 'Используйте естественный свет без резких теней.', photoTip3: 'По возможности покажите всё растение.', unknownPlant: 'Неизвестное растение', analysisComplete: 'Анализ завершён', plantCheckup: 'Проверка растения', onlyImages: 'Можно добавлять только изображения размером до 10 МБ.', maxPhotos: 'Можно анализировать до 5 фотографий за раз.', profileLoading: 'Данные профиля ещё загружаются.', accountCreated: 'Аккаунт создан.', welcomeBackToast: 'С возвращением.', signInPreferences: 'Войдите, чтобы сохранять настройки.'
        },
        uz: {
            workspace: 'Ish maydoni', dashboard: 'Bosh sahifa', history: 'Tarix', account: 'Hisob', profile: 'Profilim', settings: 'Sozlamalar',
            helpTitle: 'Yordam kerakmi?', helpText: 'O‘simliklarni yaxshi suratga olishni o‘rganing.', photoTips: 'Surat bo‘yicha maslahatlar →',
            signIn: 'Kirish', signOut: 'Chiqish', guest: 'Mehmon', signInSave: 'Tahlillarni saqlash uchun kiring', plantEnthusiast: 'O‘simlik ishqibozi',
            date: '2026-YIL 24-SENTYABR, PAYSHANBA', goodMorning: 'Xayrli tong,', there: '', welcome: 'O‘simliklaringizni sog‘lom saqlaylik.', newScan: '＋ Yangi tahlil',
            checkup: 'O‘SIMLIK TEKSHIRUVI', checkupQuestion: 'O‘simligingizda nima bo‘lyapti?', dropPhotos: 'O‘simlik suratlarini shu yerga tashlang', or: 'yoki', browse: 'qurilmadan tanlang',
            fileHelp: 'JPG, PNG yoki WEBP · 10 MB gacha · 5 tagacha surat', private: 'Suratlaringiz maxfiy saqlanadi', analyze: 'O‘simlikni tahlil qilish →',
            yourPlants: 'O‘SIMLIKLARINGIZ', recent: 'So‘nggi tekshiruvlar', viewAll: 'Barchasini ko‘rish →', currentInsight: 'JORIY NATIJA', noScan: 'Hali o‘simlik tahlil qilinmadi',
            waiting: 'Kutilmoqda', report: 'O‘simlik sog‘ligi hisoboti<br>shu yerda ko‘rsatiladi.', uploadHelp: 'Boshlash uchun barg yoki poyaning aniq suratini yuklang.',
            viewReport: 'To‘liq hisobot →', ask: 'PlantCare’dan so‘rang', aiAdvice: 'Sun’iy intellekt maslahati', chatHelp: 'Tahlildan keyin o‘simligingiz haqida<br>istalgan savolni bering.',
            chatPlaceholder: 'Qo‘shimcha savol bering…', activity: 'FAOLIYATINGIZ', historyTitle: 'Tekshiruvlar tarixi', historySubtitle: 'Tekshirilgan barcha o‘simliklar tarixi.',
            allResults: 'Barcha natijalar', healthyPlants: 'Sog‘lom o‘simliklar', needsAttention: 'E’tibor kerak', noHistory: 'Hali tekshiruvlar yo‘q', historyHelp: 'Tugallangan tahlillar shu yerda saqlanadi.',
            noMatches: 'Mos natija topilmadi', tryAgain: 'Qidiruvni o‘zgartiring yoki yangi tahlil qiling.', accountLabel: 'HISOB', profileTitle: 'Profilim',
            profileSubtitle: 'Shaxsiy ma’lumot va sozlamalarni boshqaring.', about: 'SIZ HAQINGIZDA', preferences: 'O‘simlik parvarishi afzalliklari',
            experience: 'Yetishtirish tajribasi', favorites: 'Sevimli o‘simliklar', location: 'Joylashuv', notSet: 'Belgilanmagan', editProfile: 'Profilni tahrirlash',
            guestProfile: 'Tarixni saqlash uchun hisob yarating.', scans: 'Tahlillar', savedPlants: 'Saqlangan o‘simliklar', healthy: 'Sog‘lom',
            preferenceLabel: 'AFZALLIKLAR', settingsTitle: 'Sozlamalar', settingsSubtitle: 'PlantCare’ni o‘zingizga moslang.', general: 'UMUMIY',
            emailUpdates: 'Email yangiliklari', emailUpdatesHelp: 'O‘simlik parvarishi eslatmalarini oling.', autoSave: 'Tahlillarni avtomatik saqlash',
            autoSaveHelp: 'Har bir tugallangan tahlilni saqlash.', appearance: 'KO‘RINISH', compactCards: 'Ixcham kartalar',
            compactCardsHelp: 'Ekranda ko‘proq tarixni ko‘rsatish.', interfaceLanguage: 'Interfeys tili', languageHelp: 'PlantCare AI tilini tanlang.',
            authLabel: 'PLANTCARE HISOBI', welcomeBack: 'Xush kelibsiz', signInHelp: 'Tahlillarni saqlash uchun kiring.',
            createAccount: 'Hisob yaratish', createHelp: 'O‘simliklar tarixini saqlang va istalgan joydan foydalaning.', firstName: 'Ism', lastName: 'Familiya',
            email: 'Email', username: 'Foydalanuvchi nomi', password: 'Parol', create: 'Hisob yaratish', needAccount: 'Hisobingiz yo‘qmi? Yaratish', alreadyAccount: 'Hisobingiz bormi? Kirish',
            profileEdit: 'Profilni tahrirlash', profileHelp: 'Shaxsiy ma’lumot va parvarish afzalliklarini yangilang.', save: 'Profilni saqlash',
            tipsLabel: 'SURAT MASLAHATLARI', tipsTitle: 'Yaxshiroq tahlil oling', tipsHelp: 'Aniq va yaxshi yoritilgan suratlar muammolarni yaxshiroq aniqlashga yordam beradi.',
            tip1: 'Zararlangan bargni yaqindan suratga oling.', tip2: 'Tabiiy yorug‘likdan foydalaning.', tip3: 'Imkon bo‘lsa, butun o‘simlikni ko‘rsating.',
            saved: 'Profil saqlandi.', preferenceSaved: 'Sozlama saqlandi.', signedOut: 'Hisobdan chiqdingiz.', savedConversation: 'SAQLANGAN QAYD', noConversation: 'Bu tekshiruv uchun saqlangan xabarlar yo‘q.', thinking: 'PlantCare o‘ylamoqda', thinkingReview: 'O‘simlik ma’lumotlari ko‘rib chiqilmoqda', thinkingPrepare: 'Foydali maslahat tayyorlanmoqda',
            scan: 'Tekshirish', archive: 'Arxiv', language: 'Til', countryExamples: 'MAMLAKATLAR MISOLLARI', action: 'Harakat:', demoCountry: 'Namoyish mamlakati', diseaseExample: 'Pomidor kasalligi misoli', demoSignal: 'Mahsulot namoyishi uchun ta’limiy namuna.', demoAction: 'O‘simlikni tekshiring va mahalliy tavsiyalarga amal qiling.',
            tomatoStudio: 'POMIDOR SOG‘LIGI STUDIYASI', localDiagnosis: 'Mahalliy vizual tashxis', introDiagnosis: 'Mahalliy vizual<br>tashxis', newObservation: 'YANGI KUZATUV', fileTypes: 'JPG / PNG / WEBP', stepPhoto: 'BIRINCHI QADAM · SURAT QO‘SHING', uploadQuestion: 'O‘simligingiz sizga<br>nimani aytmoqchi?', captureHelp: 'Zararlangan pomidor bargini tabiiy yorug‘likda suratga oling. Barg tekis, yaqin va fokusda bo‘lsin.', dropPhoto: 'Suratni shu yerga tashlang', selectDevice: 'qurilmadan tanlang', maxFile: 'Maksimal 10 MB · bitta surat eng aniq natijani beradi', privateDesign: 'Maxfiylik biz uchun muhim', readPlant: 'O‘simlikni o‘qish', fieldNote: 'DALADAGI QAYD', observationLives: 'Kuzatuvingiz<br>shu yerda bo‘ladi.', modelReturns: 'Surat qo‘shganingizdan so‘ng mahalliy pomidor modeli holat va keyingi qadamlarni ko‘rsatadi.', modelReading: 'MODEL NATIJASI', observation: 'Kuzatuv', doNow: 'Hozir nima qilish kerak', keepHealthy: 'Sog‘lom saqlash', anotherObservation: '＋ Yangi kuzatuv', agroverseNote: 'AGROVERSE QAYDI', modelDisclaimer: 'Bu model pomidor kasalliklarini aniqlash uchun o‘qitilgan. Natija tavsiya bo‘lib, mahalliy agronom o‘rnini bosa olmaydi.',
            lookCloser: 'Yaqinroq qarang.', growSmarter: 'Aqlliroq yetishtiring', match: 'moslik', yourFieldNotes: 'DALADAGI QAYDLARINGIZ', archiveTitle: 'Kuzatuvlar arxivi', archiveSubtitle: 'Tekshirgan barcha o‘simliklaringizning sokin tarixi.', newObservationButton: '＋ Yangi kuzatuv', searchArchive: 'Arxivdan qidirish…', allObservations: 'Barcha kuzatuvlar', completedAppear: 'Tugallangan kuzatuvlar shu yerda ko‘rinadi.', profileGrowing: 'YETISHTIRUVCHI PROFILINGIZ', aboutGrower: 'Yetishtiruvchi haqida', growingSubtitle: 'Yetishtirish ma’lumotlarini kuzatuvlaringiz bilan birga saqlang.', notes: 'Qaydlar', plants: 'O‘simliklar', healthyLabel: 'Sog‘lom', growingContext: 'YETISHTIRISH KONTEKSTI', yourPreferences: 'Sozlamalaringiz', createAccountProfile: 'Dala qaydlarini saqlash uchun hisob yarating.', studioPreferences: 'STUDIYA SOZLAMALARI', makeYours: 'O‘zingizga moslang', makeYoursSubtitle: 'Tajriba va parvarish uslubingizga moslang.', display: 'KO‘RINISH', photoGuide: 'Surat qo‘llanmasi', savedNote: 'SAQLANGAN QAYD', yourProfile: 'PROFILINGIZ', editGrowingProfile: 'Yetishtiruvchi profilini tahrirlash', updateGrowing: 'Shaxsiy ma’lumot va yetishtirish kontekstini yangilang.', growingExperience: 'Yetishtirish tajribasi', beginner: 'Boshlang‘ich', intermediate: 'O‘rta', advanced: 'Yuqori', favoritePlants: 'Sevimli o‘simliklar', close: 'Yopish', agroverseAccount: 'AGROVERSE HISOBI', photoGuideTitle: 'Foydali dala qaydini yarating', photoGuideText: 'Aniq va yaxshi yoritilgan suratlar mahalliy modelga bargni yaxshiroq o‘qishga yordam beradi.', photoTip1: 'Zararlangan bargni yaqindan suratga oling.', photoTip2: 'Tabiiy yorug‘likdan foydalaning.', photoTip3: 'Imkon bo‘lsa, butun o‘simlikni ko‘rsating.', unknownPlant: 'Noma’lum o‘simlik', analysisComplete: 'Tahlil yakunlandi', plantCheckup: 'O‘simlik tekshiruvi', onlyImages: 'Faqat 10 MB dan kichik rasmlarni qo‘shish mumkin.', maxPhotos: 'Bir vaqtda 5 tagacha suratni tahlil qilishingiz mumkin.', profileLoading: 'Profil ma’lumotlari hali yuklanmoqda.', accountCreated: 'Hisob yaratildi.', welcomeBackToast: 'Xush kelibsiz.', signInPreferences: 'Sozlamalarni saqlash uchun kiring.'
        }
    };
    const regionalTranslations = {
        en: {
            KR: ['South Korea', 'Late blight', 'A commonly monitored tomato disease example in cool, wet production periods.', 'Improve airflow, avoid wet foliage, and inspect lower leaves frequently.'],
            UZ: ['Uzbekistan', 'Early blight', 'A commonly monitored tomato leaf-spot disease example in warm production conditions.', 'Remove spotted leaves, mulch soil, and water at the base.'],
            KG: ['Kyrgyzstan', 'Septoria leaf spot', 'A commonly monitored leaf-spot disease example when leaf wetness and dense canopies occur.', 'Keep foliage dry, space plants well, and sanitize tools.'],
            KZ: ['Kazakhstan', 'Tomato leaf mold', 'A commonly monitored protected-crop disease example when humidity remains high.', 'Ventilate covered crops and remove affected leaves early.'],
            TJ: ['Tajikistan', 'Bacterial spot', 'A commonly monitored bacterial-disease example where warm weather and splashing water occur.', 'Use clean transplants, avoid overhead watering, and disinfect tools.']
        },
        ru: {
            KR: ['Южная Корея', 'Фитофтороз', 'Пример болезни томатов, которую часто контролируют в прохладные и влажные периоды.', 'Улучшайте воздухообмен, не мочите листья и чаще осматривайте нижние листья.'],
            UZ: ['Узбекистан', 'Ранняя гниль', 'Пример пятнистости листьев томатов, которую часто контролируют в тёплых условиях выращивания.', 'Удаляйте пятнистые листья, мульчируйте почву и поливайте у основания.'],
            KG: ['Кыргызстан', 'Септориоз', 'Пример пятнистости листьев, часто возникающей при влажных листьях и густой посадке.', 'Держите листву сухой, соблюдайте расстояние между растениями и очищайте инструменты.'],
            KZ: ['Казахстан', 'Кладоспориоз', 'Пример болезни защищённого грунта, которую часто контролируют при высокой влажности.', 'Проветривайте теплицы и рано удаляйте поражённые листья.'],
            TJ: ['Таджикистан', 'Бактериальная пятнистость', 'Пример бактериальной болезни при тёплой погоде и попадании брызг воды на листья.', 'Используйте чистую рассаду, не поливайте сверху и дезинфицируйте инструменты.']
        },
        uz: {
            KR: ['Janubiy Koreya', 'Fitoftoroz', 'Salqin va nam yetishtirish davrlarida ko‘p kuzatiladigan pomidor kasalligi misoli.', 'Havo aylanishini yaxshilang, barglarni ho‘llamang va pastki barglarni tez-tez tekshiring.'],
            UZ: ['O‘zbekiston', 'Erta kuyish', 'Issiq yetishtirish sharoitlarida ko‘p kuzatiladigan pomidor barg dog‘lanishi misoli.', 'Dog‘ tushgan barglarni olib tashlang, tuproqni mulchalang va tagidan sug‘oring.'],
            KG: ['Qirg‘iziston', 'Septorioz', 'Barg namligi va zich ekinlar sharoitida ko‘p kuzatiladigan barg dog‘lanishi misoli.', 'Barglarni quruq tuting, o‘simliklar orasini ochiq qoldiring va asboblarni tozalang.'],
            KZ: ['Qozog‘iston', 'Barg mog‘ori', 'Namlik yuqori bo‘lganda issiqxonalarda ko‘p kuzatiladigan kasallik misoli.', 'Issiqxonani shamollating va zararlangan barglarni erta olib tashlang.'],
            TJ: ['Tojikiston', 'Bakterial dog‘lanish', 'Iliq ob-havo va suv sachrashi sharoitida kuzatiladigan bakterial kasallik misoli.', 'Toza ko‘chatlardan foydalaning, ustidan sug‘ormang va asboblarni dezinfeksiya qiling.']
        },
        ko: {
            KR: ['대한민국', '역병', '서늘하고 습한 재배 기간에 자주 관찰되는 토마토 질병의 예입니다.', '통풍을 개선하고 잎을 젖게 하지 말며 아래쪽 잎을 자주 확인하세요.'],
            UZ: ['우즈베키스탄', '겹둥근무늬병', '따뜻한 재배 환경에서 자주 관찰되는 토마토 잎반점병의 예입니다.', '반점이 있는 잎을 제거하고 흙을 덮으며 뿌리 부분에 물을 주세요.'],
            KG: ['키르기스스탄', '셉토리아 잎반점', '잎이 젖고 잎이 빽빽한 환경에서 자주 관찰되는 잎반점병의 예입니다.', '잎을 건조하게 유지하고 식물 사이를 띄우며 도구를 소독하세요.'],
            KZ: ['카자흐스탄', '토마토 잎곰팡이병', '습도가 높을 때 시설 재배에서 자주 관찰되는 질병의 예입니다.', '시설을 환기하고 영향을 받은 잎을 일찍 제거하세요.'],
            TJ: ['타지키스탄', '세균성 반점병', '따뜻한 날씨와 물 튀김이 있는 환경에서 관찰되는 세균성 질병의 예입니다.', '깨끗한 모종을 사용하고 위에서 물을 주지 말며 도구를 소독하세요.']
        }
    };
    translations.ko = {
        ...translations.en,
        workspace: '작업 공간', dashboard: '대시보드', history: '기록', account: '계정', profile: '내 프로필', settings: '설정',
        helpTitle: '도움이 필요하신가요?', helpText: '좋은 식물 사진을 찍는 방법을 알아보세요.', photoTips: '사진 가이드 보기 →',
        signIn: '로그인', signOut: '로그아웃', guest: '게스트', signInSave: '분석을 저장하려면 로그인하세요', plantEnthusiast: '식물 애호가',
        welcome: '식물을 건강하게 가꿔 보세요.', newScan: '＋ 새 분석', checkup: '식물 검사', checkupQuestion: '식물에 무슨 일이 일어났나요?',
        dropPhotos: '식물 사진을 여기에 놓으세요', or: '또는', browse: '기기에서 선택', fileHelp: 'JPG, PNG 또는 WEBP · 최대 10MB · 최대 5장',
        private: '사진은 안전하게 보호됩니다', analyze: '식물 분석 →', currentInsight: '현재 결과', noScan: '아직 분석한 식물이 없습니다',
        waiting: '대기 중', report: '식물 건강 보고서가<br>여기에 표시됩니다.', uploadHelp: '시작하려면 잎이나 줄기의 선명한 사진을 업로드하세요.',
        activity: '활동', historyTitle: '분석 기록', historySubtitle: '확인한 모든 식물의 기록입니다.', allResults: '모든 결과',
        healthyPlants: '건강한 식물', needsAttention: '관찰 필요', noHistory: '아직 분석 기록이 없습니다', historyHelp: '완료된 식물 분석이 여기에 저장됩니다.',
        noMatches: '일치하는 분석이 없습니다', tryAgain: '검색어를 바꾸거나 새 분석을 진행하세요.', accountLabel: '계정', profileTitle: '내 프로필',
        profileSubtitle: '개인 정보와 환경 설정을 관리하세요.', about: '내 정보', preferences: '식물 관리 환경 설정', experience: '재배 경험',
        favorites: '좋아하는 식물', location: '위치', notSet: '설정되지 않음', editProfile: '프로필 수정', guestProfile: '식물 기록을 저장하려면 계정을 만드세요.',
        scans: '분석', savedPlants: '저장된 식물', healthy: '건강함', preferenceLabel: '환경 설정', settingsTitle: '설정',
        settingsSubtitle: 'Agroverse를 원하는 방식으로 설정하세요.', general: '일반', emailUpdates: '이메일 알림',
        emailUpdatesHelp: '가끔 식물 관리 알림을 받습니다.', autoSave: '분석 자동 저장', autoSaveHelp: '완료된 분석을 모두 기록합니다.',
        appearance: '화면', compactCards: '간결한 카드 사용', compactCardsHelp: '화면에 더 많은 기록을 표시합니다.', interfaceLanguage: '인터페이스 언어',
        languageHelp: 'Agroverse의 언어를 선택하세요.', authLabel: 'AGROVERSE 계정', welcomeBack: '다시 오신 것을 환영합니다',
        signInHelp: '분석을 저장하고 어디서나 확인하려면 로그인하세요.', createAccount: '계정 만들기', createHelp: '식물 기록을 저장하고 어디서나 확인하세요.',
        firstName: '이름', lastName: '성', email: '이메일', username: '사용자 이름', password: '비밀번호', create: '계정 만들기',
        needAccount: '계정이 없나요? 만들기', alreadyAccount: '이미 계정이 있나요? 로그인', profileEdit: '프로필 수정',
        profileHelp: '개인 정보와 식물 관리 환경을 업데이트하세요.', save: '프로필 저장', tipsLabel: '사진 가이드', tipsTitle: '더 정확한 분석을 받으세요',
        tipsHelp: '밝고 선명한 사진은 문제를 더 정확하게 찾는 데 도움이 됩니다.', tip1: '문제가 있는 잎을 가까이서 촬영하세요.',
        tip2: '자연광을 사용하고 강한 그림자를 피하세요.', tip3: '가능하면 식물 전체를 함께 촬영하세요.',
        saved: '프로필이 저장되었습니다.', preferenceSaved: '설정이 저장되었습니다.', signedOut: '로그아웃되었습니다.',
        savedConversation: '저장된 기록', noConversation: '이 분석에 저장된 메시지가 없습니다.', thinking: 'Agroverse가 분석 중입니다',
        thinkingReview: '식물 정보를 확인하는 중입니다', thinkingPrepare: '도움이 되는 안내를 준비하는 중입니다',
        scan: '분석', archive: '기록', language: '언어', countryExamples: '국가별 예시', action: '조치:',
        demoCountry: '예시 국가', diseaseExample: '토마토 질병 예시', demoSignal: '제품 데모를 위한 교육용 예시입니다.',
        demoAction: '식물을 확인하고 현지 지침을 따르세요.', tomatoStudio: '토마토 건강 스튜디오', localDiagnosis: '로컬 시각 진단',
        introDiagnosis: '로컬 시각<br>진단', newObservation: '새 관찰', fileTypes: 'JPG / PNG / WEBP', stepPhoto: '1단계 · 사진 추가',
        uploadQuestion: '식물이<br>무엇을 말하고 있나요?', captureHelp: '영향을 받은 토마토 잎을 자연광에서 촬영하세요. 잎을 평평하고 가까이, 선명하게 촬영하세요.',
        dropPhoto: '사진을 여기에 놓으세요', selectDevice: '기기에서 선택', maxFile: '최대 10MB · 사진 한 장이 가장 정확한 결과를 제공합니다.',
        privateDesign: '개인정보 보호 설계', readPlant: '식물 읽기', fieldNote: '현장 기록', observationLives: '관찰 결과가<br>여기에 표시됩니다.',
        modelReturns: '사진을 추가하면 로컬 토마토 모델이 상태와 다음 단계를 알려줍니다.', modelReading: '모델 결과',
        observation: '관찰', doNow: '지금 할 일', keepHealthy: '건강하게 유지하기', anotherObservation: '＋ 새 관찰',
        agroverseNote: 'AGROVERSE 안내', modelDisclaimer: '이 모델은 토마토 질병을 판별하도록 학습되었습니다. 결과는 안내용이며 현지 농업 전문가를 대신하지 않습니다.',
        lookCloser: '자세히 살펴보세요.', growSmarter: '더 현명하게 재배하세요', match: '일치', yourFieldNotes: '나의 현장 기록',
        archiveTitle: '관찰 기록', archiveSubtitle: '확인한 모든 식물의 기록입니다.', newObservationButton: '＋ 새 관찰', searchArchive: '기록 검색…',
        allObservations: '모든 관찰', completedAppear: '완료된 관찰이 여기에 표시됩니다.', profileGrowing: '재배자 프로필',
        aboutGrower: '재배자 정보', growingSubtitle: '재배 정보를 관찰 기록과 함께 관리하세요.', notes: '기록', plants: '식물',
        healthyLabel: '건강함', growingContext: '재배 정보', yourPreferences: '환경 설정', createAccountProfile: '현장 기록을 저장하려면 계정을 만드세요.',
        studioPreferences: '스튜디오 설정', makeYours: '나에게 맞추기', makeYoursSubtitle: '식물을 관리하는 방식에 맞게 환경을 설정하세요.',
        display: '화면', photoGuide: '사진 가이드', yourProfile: '내 프로필', editGrowingProfile: '재배자 프로필 수정',
        updateGrowing: '개인 정보와 재배 정보를 업데이트하세요.', growingExperience: '재배 경험', beginner: '초급', intermediate: '중급',
        advanced: '고급', favoritePlants: '좋아하는 식물', close: '닫기', agroverseAccount: 'AGROVERSE 계정',
        photoGuideTitle: '유용한 현장 기록 만들기', photoGuideText: '밝고 선명한 사진은 로컬 모델이 잎을 더 정확하게 판독하는 데 도움이 됩니다.',
        photoTip1: '영향을 받은 잎을 가까이서 촬영하세요.', photoTip2: '자연광을 사용하고 강한 그림자를 피하세요.', photoTip3: '가능하면 식물 전체를 포함하세요.',
        unknownPlant: '알 수 없는 식물', analysisComplete: '분석 완료', plantCheckup: '식물 검사', onlyImages: '10MB 이하의 이미지 파일만 추가할 수 있습니다.',
        maxPhotos: '한 번에 최대 5장의 사진을 분석할 수 있습니다.', profileLoading: '프로필 정보를 불러오는 중입니다.',
        accountCreated: '계정이 생성되었습니다.', welcomeBackToast: '다시 오신 것을 환영합니다.', signInPreferences: '환경 설정을 저장하려면 로그인하세요.'
    };
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];
    const fileInput = $('#file-input');
    const dropZone = $('#drop-zone');
    const selectedFiles = $('#selected-files');
    const analyzeButton = $('#analyze-button');

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
    }
    function csrfToken() {
        const cookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
    }
    async function apiFetch(url, options = {}) {
        const config = {...options, credentials: 'same-origin', headers: {...(options.headers || {})}};
        if (config.method && config.method !== 'GET') config.headers['X-CSRFToken'] = csrfToken();
        const response = await fetch(url, config);
        let data = {};
        const rawText = await response.text();
        if (rawText) {
            try { data = JSON.parse(rawText); } catch (_) { data = { error: rawText }; }
        }
        if (!response.ok) {
            const detail = data.error || data.detail || (typeof data === 'object' ? Object.values(data).flat().join(' ') : '') || 'Request failed.';
            throw new Error(detail);
        }
        return data;
    }
    function showToast(message) {
        const toast = $('#toast');
        toast.textContent = message;
        toast.classList.add('show');
        window.setTimeout(() => toast.classList.remove('show'), 2800);
    }
    function t(key) { return translations[state.language || 'en'][key] || translations.en[key] || key; }
    function setText(selector, key, html = false) {
        const element = $(selector);
        if (element) html ? element.innerHTML = t(key) : element.textContent = t(key);
    }
    function updateWelcomeName() {
        const nameElement = $('#welcome-name');
        const separatorElement = $('#welcome-separator');
        if (!nameElement) return;
        const name = state.user ? (state.user.first_name || state.user.username) : '';
        nameElement.textContent = name;
        if (separatorElement) separatorElement.textContent = name ? ', ' : '';
    }
    function applyLanguage(language) {
        state.language = ['en', 'ru', 'uz', 'ko'].includes(language) ? language : 'en';
        document.documentElement.lang = state.language;
        setText('.nav-label', 'workspace');
        setText('.nav-label-spaced', 'account');
        $('.nav-item[data-view="dashboard"]').textContent = t('scan');
        $('.nav-item[data-view="history"]').innerHTML = `${t('archive')} <span class="nav-count" id="history-count">${state.diagnoses.length}</span>`;
        $('.nav-item[data-view="profile"]').textContent = t('profile');
        $('.nav-item[data-view="settings"]').textContent = t('settings');
        setText('.help-card strong', 'helpTitle');
        setText('.help-card p', 'helpText');
        setText('#tips-button', 'photoTips');
        updateWelcomeName();
        setText('.breadcrumb span', 'workspace');
        const activeView = $('.page-view.active')?.id?.replace('-view', '') || 'dashboard';
        setText('#page-kicker', activeView === 'dashboard' ? 'scan' : activeView);
        updateWelcomeName();
        setText('.welcome-row .subheading', 'welcome');
        setText('#new-scan-button', 'newScan');
        setText('.upload-panel .section-kicker', 'checkup');
        setText('.upload-panel h2', 'checkupQuestion');
        setText('.drop-zone h3', 'dropPhotos');
        setText('.drop-zone p button', 'browse');
        setText('.drop-zone small', 'fileHelp');
        setText('.upload-footer > span', 'private');
        setText('#analyze-button', 'analyze');
        setText('.insight-panel .section-kicker', 'currentInsight');
        if (!state.currentDiagnosisId) {
            setText('#result-title', 'noScan');
            setText('#result-status', 'waiting');
        }
        setText('#result-placeholder h3', 'report', true);
        setText('#result-placeholder p', 'uploadHelp');
        setText('#history-view .eyebrow', 'activity');
        setText('#history-view h1', 'historyTitle');
        setText('#history-view .subheading', 'historySubtitle');
        setText('#history-view .primary-button', 'newScan');
        setText('#history-filter option[value="all"]', 'allResults');
        setText('#history-filter option[value="healthy"]', 'healthyPlants');
        setText('#history-filter option[value="issues"]', 'needsAttention');
        setText('#profile-view .eyebrow', 'accountLabel');
        setText('#profile-view h1', 'profileTitle');
        setText('#profile-view .subheading', 'profileSubtitle');
        setText('.info-panel .section-kicker', 'about');
        setText('.info-panel h2', 'preferences');
        setText('.info-row:nth-of-type(1) span', 'experience');
        setText('.info-row:nth-of-type(2) span', 'favorites');
        setText('.info-row:nth-of-type(3) span', 'location');
        setText('#profile-auth-button', state.user ? 'editProfile' : 'signIn');
        setText('#settings-view .eyebrow', 'preferenceLabel');
        setText('#settings-view h1', 'settingsTitle');
        setText('#settings-view .subheading', 'settingsSubtitle');
        $$('.setting-row strong, .setting-row small, .section-kicker[data-i18n]').forEach((element) => {
            const key = element.dataset.i18n;
            if (key) element.textContent = t(key);
        });
        $$('#history-chat-modal [data-i18n]').forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });
        setText('#profile-modal .section-kicker', 'profileEdit');
        setText('#profile-modal h2', 'profileEdit');
        setText('#profile-modal > .auth-modal > p', 'profileHelp');
        const profileLabelKeys = ['firstName', 'lastName', 'email', 'experience', 'favorites', 'location'];
        $$('#profile-form label').forEach((label, index) => {
            const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.textContent = `${t(profileLabelKeys[index])} `;
        });
        const experienceLabels = {
            en: ['Beginner', 'Intermediate', 'Advanced'],
            ru: ['Начинающий', 'Средний', 'Продвинутый'],
            uz: ['Boshlang‘ich', 'O‘rta', 'Yuqori'],
            ko: ['초급', '중급', '고급']
        }[state.language] || ['Beginner', 'Intermediate', 'Advanced'];
        $('#profile-experience-input').options[0].text = experienceLabels[0];
        $('#profile-experience-input').options[1].text = experienceLabels[1];
        $('#profile-experience-input').options[2].text = experienceLabels[2];
        setText('#profile-save', 'save');
        setText('#auth-modal .section-kicker', 'authLabel');
        setText('#auth-title', state.authMode === 'register' ? 'createAccount' : 'welcomeBack');
        setText('#auth-description', state.authMode === 'register' ? 'createHelp' : 'signInHelp');
        $$('#auth-form label').forEach((label) => {
            const input = label.querySelector('input');
            const key = input?.id === 'auth-first-name' ? 'firstName' : input?.id === 'auth-email' ? 'email' : input?.id === 'auth-password' ? 'password' : input?.id === 'auth-username' ? 'username' : null;
            if (key) label.childNodes[0].textContent = `${t(key)} `;
        });
        setText('#auth-submit', state.authMode === 'register' ? 'create' : 'signIn');
        setText('#auth-switch', state.authMode === 'register' ? 'alreadyAccount' : 'needAccount');
        setText('#tips-modal .section-kicker', 'tipsLabel');
        setText('#tips-modal h2', 'tipsTitle');
        setText('#tips-modal > .tips-modal > p', 'tipsHelp');
        $$('.tips-list span').forEach((element, index) => element.textContent = t(`tip${index + 1}`));
        $$('[data-i18n]').forEach((element) => {
            if (element.classList.contains('nav-item')) return;
            const key = element.dataset.i18n;
            if (!key || !translations[state.language][key]) return;
            const value = t(key);
            if (value.includes('<br>')) element.innerHTML = value;
            else element.textContent = value;
        });
        $$('[data-i18n-placeholder]').forEach((element) => {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });
        if ($('#preference-language')) $('#preference-language').value = state.language;
        if ($('#navbar-language')) $('#navbar-language').value = state.language;
        $('#sidebar-name').textContent = state.user ? (state.user.first_name || state.user.username) : t('guest');
        $('#sidebar-subtitle').textContent = state.user ? (state.user.email || t('plantEnthusiast')) : t('signInSave');
        $('#auth-button').textContent = state.user ? t('signOut') : t('signIn');
        $('#profile-meta').textContent = state.user ? state.user.email : t('guestProfile');
        if (state.currentDiagnosisId) {
            const currentDiagnosis = state.diagnoses.find((item) => item.id === state.currentDiagnosisId);
            if (currentDiagnosis) updateResult(currentDiagnosis);
        }
        updateWelcomeName();
        if (renderRegionalWatch) renderRegionalWatch();
    }
    function setView(viewName) {
        $$('.page-view').forEach((view) => view.classList.toggle('active', view.id === `${viewName}-view`));
        $$('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === viewName));
        $('#page-kicker').textContent = t(viewName);
        $('#sidebar').classList.remove('open');
        $('#mobile-overlay').classList.remove('show');
        if (viewName === 'history') renderHistory();
        if (viewName === 'profile' || viewName === 'settings') loadAccountData();
    }
    $$('[data-view]').forEach((item) => item.addEventListener('click', (event) => {
        event.preventDefault();
        setView(item.dataset.view);
    }));
    $('#menu-button').addEventListener('click', () => {
        $('#studio-nav')?.classList.toggle('open');
        $('#sidebar').classList.add('open');
        $('#mobile-overlay').classList.add('show');
    });
    $('#mobile-overlay').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
        $('#studio-nav')?.classList.remove('open');
        $('#mobile-overlay').classList.remove('show');
    });
    function resetScan() {
        state.files = [];
        state.currentDiagnosisId = null;
        renderFiles();
        $('#result-content').classList.add('hidden');
        $('#result-placeholder').classList.remove('hidden');
        $('#result-status').textContent = t('waiting');
        $('#result-status').className = 'status-badge neutral';
        $('#result-title').textContent = t('noScan');
        $('#new-result-scan-button').classList.add('hidden');
        $('#upload-panel').classList.remove('hidden');
    }
    function startNewScan() {
        resetScan();
        setView('dashboard');
        $('#upload-panel').scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    if ($('#new-scan-button')) $('#new-scan-button').addEventListener('click', startNewScan);
    if ($('#new-result-scan-button')) $('#new-result-scan-button').addEventListener('click', startNewScan);
    function renderFiles() {
        selectedFiles.innerHTML = state.files.map((file, index) => {
            const url = URL.createObjectURL(file);
            return `<div class="file-thumb"><img src="${url}" alt="${escapeHtml(file.name)}"><button type="button" data-remove-file="${index}" aria-label="Remove photo">×</button></div>`;
        }).join('');
        $$('[data-remove-file]').forEach((button) => button.addEventListener('click', () => {
            state.files.splice(Number(button.dataset.removeFile), 1);
            renderFiles();
        }));
        analyzeButton.disabled = state.files.length === 0;
    }
    function addFiles(files) {
        const incoming = [...files];
        const valid = incoming.filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);
        if (valid.length !== incoming.length) showToast(t('onlyImages'));
        state.files = [...state.files, ...valid].slice(0, 5);
        if (incoming.length > 5 || valid.length + state.files.length > 5) showToast(t('maxPhotos'));
        renderFiles();
    }
    $('#browse-button').addEventListener('click', (event) => { event.stopPropagation(); fileInput.click(); });
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
    ['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); }));
    ['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); }));
    dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));
    function formatAssistantText(text) {
        let formatted = escapeHtml(text).trim();
        formatted = formatted
            .replace(/^Plant:\s*/gim, '🌿 <strong>Plant:</strong> ')
            .replace(/^Status:\s*/gim, '🔎 <strong>Status:</strong> ')
            .replace(/^Treatment strategy:\s*/gim, '💊 <strong>Treatment strategy:</strong> ')
            .replace(/^Prevention:\s*/gim, '🛡️ <strong>Prevention:</strong> ')
            .replace(/^Diagnosis:\s*/gim, '🔎 <strong>Diagnosis:</strong> ')
            .replace(/^Treatment:\s*/gim, '💊 <strong>Treatment:</strong> ')
            .replace(/^(\d+)[.)]\s+/gm, '• ')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n{2,}/g, '<br><br>')
            .replace(/\n/g, '<br>');
        return formatted || `🌱 ${t('helpText')}`;
    }
    function showTypingIndicator() {
        hideTypingIndicator();
        const chatBox = $('#chat-box');
        const empty = chatBox.querySelector('.chat-empty');
        if (empty) empty.remove();
        const indicator = document.createElement('div');
        indicator.className = 'typing-message';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-avatar">✦</div><div class="typing-bubble"><span class="typing-label">${t('thinking')}</span><span class="typing-dots"><i></i><i></i><i></i></span></div>`;
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
        const messages = ['thinking', 'thinkingReview', 'thinkingPrepare'];
        let index = 0;
        state.typingTimer = window.setInterval(() => {
            index = (index + 1) % messages.length;
            const label = indicator.querySelector('.typing-label');
            if (label) {
                label.classList.add('typing-label-change');
                window.setTimeout(() => {
                    label.textContent = t(messages[index]);
                    label.classList.remove('typing-label-change');
                }, 120);
            }
        }, 1800);
        $('.ai-avatar')?.classList.add('thinking');
    }
    function hideTypingIndicator() {
        if (state.typingTimer) {
            window.clearInterval(state.typingTimer);
            state.typingTimer = null;
        }
        $('#typing-indicator')?.remove();
        $('.ai-avatar')?.classList.remove('thinking');
    }
    function updateResult(diagnosis) {
        $('#upload-panel').classList.add('hidden');
        $('#result-placeholder').classList.add('hidden');
        $('#result-content').classList.remove('hidden');
        $('#new-result-scan-button').classList.remove('hidden');
        $('#result-title').textContent = diagnosis.plant_name || t('plantCheckup');
        const disease = diagnosis.disease_detected || t('analysisComplete');
        const healthy = disease.toLowerCase().includes('healthy');
        $('#result-status').textContent = healthy ? t('healthy') : t('needsAttention');
        $('#result-status').className = `status-badge ${healthy ? 'healthy' : 'attention'}`;
        $('#result-disease').textContent = disease;
        const treatment = diagnosis.treatment_advice || '';
        const summaryMarker = '\n\nTreatment:\n';
        const summary = treatment.includes(summaryMarker) ? treatment.split(summaryMarker)[0] : treatment;
        const advice = treatment.includes(summaryMarker) ? treatment.split(summaryMarker)[1] : treatment;
        $('#result-summary').textContent = summary;
        $('#result-advice').textContent = advice;
        $('#result-prevention').textContent = diagnosis.prevention_advice || t('demoAction');
        $('#result-image').src = diagnosis.image;
        $('#confidence-label').textContent = diagnosis.confidence ? `${Math.round(diagnosis.confidence * 100)}% ${t('match')}` : t('localDiagnosis');
    }
    async function analyzeFile(file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('language', state.language || 'en');
        return apiFetch('/api/analyze/', {method: 'POST', body: formData});
    }
    analyzeButton.addEventListener('click', async () => {
        if (!state.files.length) return;
        analyzeButton.disabled = true;
        analyzeButton.innerHTML = `${t('analyze').replace('→', '')} <span class="loading-dots">···</span>`;
        $('#result-title').textContent = t('checkupQuestion');
        $('#result-status').textContent = t('waiting');
        $('#result-status').className = 'status-badge neutral';
        try {
            let latest;
            for (const file of state.files) latest = await analyzeFile(file);
            state.currentDiagnosisId = latest.id;
            state.diagnoses.unshift(latest);
            updateResult(latest);
            updateRecent();
            updateCounts();
            showToast('Your plant report is ready.');
        } catch (error) {
            showToast(error.message);
            $('#result-title').textContent = t('noMatches');
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.innerHTML = t('analyze');
        }
    });
    async function loadHistory() {
        try { state.diagnoses = await apiFetch(`/api/history/?language=${encodeURIComponent(state.language || 'en')}`); }
        catch (error) { showToast(error.message); }
        updateCounts();
        updateRecent();
    }
    async function loadAccountData() {
        if (!state.user) return;
        try {
            const [plants, profile, preferences] = await Promise.all([
                apiFetch('/api/plants/'),
                apiFetch('/api/profile/'),
                apiFetch('/api/preferences/'),
            ]);
            state.plants = plants;
            state.profile = profile;
            state.preferences = preferences;
            $('#profile-plant-count').textContent = state.plants.length;
            renderProfile();
            renderPreferences();
        } catch (error) { showToast(error.message); }
    }
    function renderProfile() {
        if (!state.profile) return;
        const experienceNames = {
            beginner: ({ru: 'Начинающий', uz: 'Boshlang‘ich', ko: '초급'}[state.language] || 'Beginner'),
            intermediate: ({ru: 'Средний', uz: 'O‘rta', ko: '중급'}[state.language] || 'Intermediate'),
            advanced: ({ru: 'Продвинутый', uz: 'Yuqori', ko: '고급'}[state.language] || 'Advanced'),
        };
        $('#profile-experience').textContent = experienceNames[state.profile.experience_level] || t('notSet');
        $('#profile-favorites').textContent = state.profile.favorite_plants || t('notSet');
        $('#profile-location').textContent = state.profile.location || t('notSet');
    }
    function renderPreferences() {
        if (!state.preferences) return;
        $$('.toggle[data-preference]').forEach((toggle) => {
            toggle.checked = Boolean(state.preferences[toggle.dataset.preference]);
        });
        applyLanguage(state.preferences.language || 'en');
    }
    function isHealthy(diagnosis) {
        const disease = (diagnosis.disease_detected || '').toLowerCase();
        return ['healthy', 'здоров', 'sog‘lom', 'soglom', '건강'].some((word) => disease.includes(word));
    }
    function formatDate(date) { return new Date(date).toLocaleDateString({en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ', ko: 'ko-KR'}[state.language] || 'en-US', {month: 'short', day: 'numeric', year: 'numeric'}); }
    function diagnosisCard(diagnosis) {
        const healthy = isHealthy(diagnosis);
        return `<article class="history-card" data-diagnosis-id="${diagnosis.id}" tabindex="0" role="button" aria-label="${escapeHtml(diagnosis.plant_name || t('plantCheckup'))}"><img src="${escapeHtml(diagnosis.image)}" alt="${escapeHtml(diagnosis.plant_name || t('unknownPlant'))}"><div class="history-card-body"><h3>${escapeHtml(diagnosis.plant_name || t('unknownPlant'))}</h3><p>${escapeHtml(diagnosis.disease_detected || t('analysisComplete'))}</p><div class="history-card-meta"><span>${formatDate(diagnosis.created_at)}</span><span class="status-badge ${healthy ? 'healthy' : 'attention'}">${healthy ? t('healthy') : t('needsAttention')}</span></div></div></article>`;
    }
    function renderHistory() {
        const term = ($('#history-search').value || '').toLowerCase();
        const filter = $('#history-filter').value;
        const records = state.diagnoses.filter((item) => {
            const matchesTerm = `${item.plant_name} ${item.disease_detected}`.toLowerCase().includes(term);
            return matchesTerm && (filter === 'all' || (filter === 'healthy' ? isHealthy(item) : !isHealthy(item)));
        });
        $('#history-grid').innerHTML = records.length ? records.map(diagnosisCard).join('') : `<div class="empty-state"><span>◷</span><h3>${t('noMatches')}</h3><p>${t('tryAgain')}</p></div>`;
        $$('#history-grid .history-card').forEach((card) => {
            card.addEventListener('click', () => openHistoryChat(Number(card.dataset.diagnosisId)));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openHistoryChat(Number(card.dataset.diagnosisId));
                }
            });
        });
    }
    async function openHistoryChat(diagnosisId) {
        let diagnosis = state.diagnoses.find((item) => item.id === diagnosisId);
        if (!diagnosis) return;
        try {
            if (state.user) {
                diagnosis = await apiFetch(
                    `/api/history/${diagnosisId}/?language=${encodeURIComponent(state.language || 'en')}`
                );
            }
        } catch (error) {
            showToast(error.message);
            return;
        }
        const healthy = isHealthy(diagnosis);
        $('#history-chat-image').src = diagnosis.image;
        $('#history-chat-title').textContent = diagnosis.plant_name || t('plantCheckup');
        $('#history-chat-date').textContent = formatDate(diagnosis.created_at);
        $('#history-chat-status').textContent = healthy ? t('healthy') : t('needsAttention');
        $('#history-chat-status').className = `status-badge ${healthy ? 'healthy' : 'attention'}`;
        $('#history-chat-disease').textContent = diagnosis.disease_detected || '';
        $('#history-chat-advice').textContent = diagnosis.treatment_advice || '';
        const messages = diagnosis.messages || [];
        $('#history-chat-messages').innerHTML = messages.length
            ? messages.map((message) => `<div class="history-message ${message.sender}"><span>${message.sender === 'ai' ? formatAssistantText(message.message) : escapeHtml(message.message).replace(/\n/g, '<br>')}</span></div>`).join('')
            : `<div class="chat-empty">${t('noConversation')}</div>`;
        $('#history-chat-modal').classList.remove('hidden');
    }
    function updateRecent() {
        if (!$('#recent-list')) return;
        $('#recent-list').innerHTML = state.diagnoses.slice(0, 3).map((diagnosis) => `<div class="recent-row"><img src="${escapeHtml(diagnosis.image)}" alt=""><div><strong>${escapeHtml(diagnosis.plant_name || t('unknownPlant'))}</strong><small>${escapeHtml(diagnosis.disease_detected || t('analysisComplete'))} · ${formatDate(diagnosis.created_at)}</small></div></div>`).join('') || `<div class="empty-state small"><span>✿</span><p>${t('historyHelp')}</p></div>`;
    }
    function updateCounts() {
        $('#history-count').textContent = state.diagnoses.length;
        $('#profile-scan-count').textContent = state.diagnoses.length;
        const healthyCount = state.diagnoses.filter(isHealthy).length;
        $('#profile-healthy-count').textContent = state.diagnoses.length ? healthyCount : '—';
    }
    function setUser(user) {
        state.user = user;
        const name = user ? (user.first_name || user.username) : 'Guest user';
        const initials = user ? (user.first_name || user.username).slice(0, 2).toUpperCase() : 'GU';
        ['sidebar-avatar', 'top-avatar', 'profile-avatar'].forEach((id) => { if ($(`#${id}`)) $(`#${id}`).textContent = initials; });
        $('#sidebar-name').textContent = name;
        $('#sidebar-subtitle').textContent = user ? (user.email || 'Plant enthusiast') : 'Sign in to save scans';
        updateWelcomeName();
        $('#profile-name').textContent = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Guest user';
        $('#profile-meta').textContent = user ? user.email : 'Create an account to keep your plant history.';
        $('#auth-button').textContent = user ? t('signOut') : t('signIn');
        $('#profile-auth-button').textContent = user ? t('editProfile') : t('signIn');
        applyLanguage(state.language || 'en');
    }
    function openAuth(mode = 'login') {
        state.authMode = mode;
        const register = mode === 'register';
        $('#auth-title').textContent = register ? t('createAccount') : t('welcomeBack');
        $('#auth-description').textContent = register ? t('createHelp') : t('signInHelp');
        $$('.auth-extra').forEach((field) => field.classList.toggle('hidden', !register));
        $('#auth-email').required = register;
        $('#auth-submit').textContent = register ? t('create') : t('signIn');
        $('#auth-switch').textContent = register ? t('alreadyAccount') : t('needAccount');
        $('#auth-modal').classList.remove('hidden');
    }
    $('#auth-button').addEventListener('click', async () => {
        if (!state.user) return openAuth();
        try { await apiFetch('/api/auth/logout/', {method: 'POST'}); setUser(null); state.diagnoses = []; updateCounts(); updateRecent();         showToast(t('signedOut')); }
        catch (error) { showToast(error.message); }
    });
    $('#profile-auth-button').addEventListener('click', () => {
        if (!state.user) return openAuth();
        if (!state.profile) return showToast(t('profileLoading'));
        $('#profile-first-name').value = state.profile.first_name || '';
        $('#profile-last-name').value = state.profile.last_name || '';
        $('#profile-email').value = state.profile.email || '';
        $('#profile-experience-input').value = state.profile.experience_level || 'beginner';
        $('#profile-favorites-input').value = state.profile.favorite_plants || '';
        $('#profile-location-input').value = state.profile.location || '';
        $('#profile-modal').classList.remove('hidden');
    });
    $('#close-profile').addEventListener('click', () => $('#profile-modal').classList.add('hidden'));
    $('#profile-modal').addEventListener('click', (event) => { if (event.target.id === 'profile-modal') event.target.classList.add('hidden'); });
    $('#profile-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = $('#profile-save');
        button.disabled = true;
        try {
            const profile = await apiFetch('/api/profile/', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    first_name: $('#profile-first-name').value.trim(),
                    last_name: $('#profile-last-name').value.trim(),
                    email: $('#profile-email').value.trim(),
                    experience_level: $('#profile-experience-input').value,
                    favorite_plants: $('#profile-favorites-input').value.trim(),
                    location: $('#profile-location-input').value.trim(),
                }),
            });
            state.profile = profile;
            state.user = {...state.user, first_name: profile.first_name, last_name: profile.last_name, email: profile.email};
            setUser(state.user);
            renderProfile();
            $('#profile-modal').classList.add('hidden');
            showToast('Profile saved.');
        } catch (error) {
            showToast(error.message);
        } finally {
            button.disabled = false;
        }
    });
    $('#auth-switch').addEventListener('click', () => openAuth(state.authMode === 'login' ? 'register' : 'login'));
    $('#close-auth').addEventListener('click', () => $('#auth-modal').classList.add('hidden'));
    $('#auth-modal').addEventListener('click', (event) => { if (event.target.id === 'auth-modal') event.target.classList.add('hidden'); });
    $('#auth-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const register = state.authMode === 'register';
        const payload = {username: $('#auth-username').value.trim(), password: $('#auth-password').value};
        if (register) Object.assign(payload, {email: $('#auth-email').value.trim(), first_name: $('#auth-first-name').value.trim()});
        $('#auth-submit').disabled = true;
        try {
            const user = await apiFetch(register ? '/api/auth/register/' : '/api/auth/login/', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
            setUser(user);
            $('#auth-modal').classList.add('hidden');
            await loadHistory();
            await loadAccountData();
            showToast(register ? t('accountCreated') : t('welcomeBackToast'));
        } catch (error) { showToast(error.message); }
        finally { $('#auth-submit').disabled = false; }
    });
    $$('.toggle[data-preference]').forEach((toggle) => toggle.addEventListener('change', async () => {
        if (!state.user) return showToast(t('signInPreferences'));
        try { await apiFetch('/api/preferences/', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({[toggle.dataset.preference]: toggle.checked})});         showToast(t('preferenceSaved')); }
        catch (error) { toggle.checked = !toggle.checked; showToast(error.message); }
    }));
    $('#preference-language').addEventListener('change', async (event) => {
        await changeLanguage(event.target.value);
    });
    $('#navbar-language').addEventListener('change', async (event) => {
        await changeLanguage(event.target.value);
    });
    async function changeLanguage(language) {
        applyLanguage(language);
        localStorage.setItem('plantcare-language', language);
        if (state.currentDiagnosisId && state.user) {
            try {
                const localizedDiagnosis = await apiFetch(`/api/history/${state.currentDiagnosisId}/?language=${encodeURIComponent(language)}`);
                const index = state.diagnoses.findIndex((item) => item.id === state.currentDiagnosisId);
                if (index >= 0) state.diagnoses[index] = localizedDiagnosis;
                updateResult(localizedDiagnosis);
            } catch (error) {
                showToast(error.message);
            }
        }
        await loadHistory();
        if (!state.user) return showToast(t('preferenceSaved'));
        try {
            await apiFetch('/api/preferences/', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({language})});
            showToast(t('preferenceSaved'));
        } catch (error) {
            showToast(error.message);
        }
    }
    function initRegionalWatch() {
        const country = $('#watch-country');
        const disease = $('#watch-disease');
        const signal = $('#watch-signal');
        const action = $('#watch-action-text');
        const index = $('#watch-index');
        if (!country || !disease || !signal || !action || !index) return;
        fetch('/static/data/regional_disease_watch.json')
            .then((response) => {
                if (!response.ok) throw new Error('Regional watch data unavailable.');
                return response.json();
            })
            .then((watch) => {
                const items = Array.isArray(watch.items) ? watch.items : [];
                if (!items.length) throw new Error('Regional watch data is empty.');
                let current = 0;
                let timer;
                renderRegionalWatch = () => {
                    const item = items[current];
                    const localized = regionalTranslations[state.language]?.[item.country_code];
                    const values = localized || [item.country, item.disease, item.signal, item.action];
                    country.textContent = values[0];
                    disease.textContent = values[1];
                    signal.textContent = values[2];
                    action.textContent = values[3];
                    index.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
                };
                const move = (direction) => {
                    current = (current + direction + items.length) % items.length;
                    renderRegionalWatch();
                    window.clearInterval(timer);
                    timer = window.setInterval(() => move(1), 7000);
                };
                $('#watch-prev')?.addEventListener('click', () => move(-1));
                $('#watch-next')?.addEventListener('click', () => move(1));
                renderRegionalWatch();
                timer = window.setInterval(() => move(1), 7000);
            })
            .catch((error) => {
                console.warn(error.message);
                country.textContent = t('demoCountry');
                disease.textContent = t('diseaseExample');
                signal.textContent = t('demoSignal');
                action.textContent = t('demoAction');
            });
    }
    $('#history-search').addEventListener('input', renderHistory);
    $('#history-filter').addEventListener('change', renderHistory);
    $('#tips-button').addEventListener('click', () => $('#tips-modal').classList.remove('hidden'));
    $('#close-tips').addEventListener('click', () => $('#tips-modal').classList.add('hidden'));
    $('#tips-modal').addEventListener('click', (event) => { if (event.target.id === 'tips-modal') event.target.classList.add('hidden'); });
    $('#close-history-chat').addEventListener('click', () => $('#history-chat-modal').classList.add('hidden'));
    $('#history-chat-modal').addEventListener('click', (event) => {
        if (event.target.id === 'history-chat-modal') event.target.classList.add('hidden');
    });
    async function init() {
        state.language = localStorage.getItem('plantcare-language') || 'en';
        applyLanguage(state.language);
        try { setUser(await apiFetch('/api/auth/me/')); } catch (_) { setUser(null); }
        await loadHistory();
        if (state.user) {
            await loadAccountData();
            await loadHistory();
        }
        else applyLanguage(state.language);
        initRegionalWatch();
    }
    init();
})();
