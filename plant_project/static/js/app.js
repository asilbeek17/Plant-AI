(() => {
    const state = { files: [], currentDiagnosisId: null, diagnoses: [], plants: [], user: null, profile: null, preferences: null, authMode: 'login', typingTimer: null };
    const translations = {
        en: {
            workspace: 'Workspace', dashboard: 'Dashboard', history: 'History', account: 'Account', profile: 'My profile', settings: 'Settings',
            helpTitle: 'Need a little help?', helpText: 'Learn how to take the best plant photos.', photoTips: 'View photo tips →',
            signIn: 'Sign in', signOut: 'Sign out', guest: 'Guest user', signInSave: 'Sign in to save scans', plantEnthusiast: 'Plant enthusiast',
            date: 'THURSDAY, SEPTEMBER 24, 2026', goodMorning: 'Good morning,', there: 'there', welcome: 'Let’s keep your plants happy and healthy.', newScan: '＋ New scan',
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
            email: 'Email', password: 'Password', create: 'Create account', needAccount: 'Need an account? Create one', alreadyAccount: 'Already have an account? Sign in',
            profileEdit: 'Edit profile', profileHelp: 'Update your plant-care preferences and personal details.', save: 'Save profile',
            tipsLabel: 'PHOTO TIPS', tipsTitle: 'Get a better diagnosis', tipsHelp: 'Clear, well-lit photos help PlantCare AI spot issues more accurately.',
            tip1: 'Photograph the affected leaf up close.', tip2: 'Use natural light and avoid harsh shadows.', tip3: 'Include the whole plant when possible.',
            saved: 'Profile saved.', preferenceSaved: 'Preference saved.', signedOut: 'You have been signed out.', savedConversation: 'SAVED CONVERSATION', noConversation: 'No saved messages for this checkup.', thinking: 'PlantCare is thinking', thinkingReview: 'Reviewing your plant context', thinkingPrepare: 'Preparing helpful guidance'
        },
        ru: {
            workspace: 'Рабочая область', dashboard: 'Панель', history: 'История', account: 'Аккаунт', profile: 'Мой профиль', settings: 'Настройки',
            helpTitle: 'Нужна помощь?', helpText: 'Узнайте, как делать лучшие фотографии растений.', photoTips: 'Советы по фото →',
            signIn: 'Войти', signOut: 'Выйти', guest: 'Гость', signInSave: 'Войдите, чтобы сохранять анализы', plantEnthusiast: 'Любитель растений',
            date: 'ЧЕТВЕРГ, 24 СЕНТЯБРЯ 2026', goodMorning: 'Доброе утро,', there: 'друг', welcome: 'Давайте заботиться о ваших растениях.', newScan: '＋ Новый анализ',
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
            email: 'Email', password: 'Пароль', create: 'Создать аккаунт', needAccount: 'Нет аккаунта? Создать', alreadyAccount: 'Уже есть аккаунт? Войти',
            profileEdit: 'Изменить профиль', profileHelp: 'Обновите данные и предпочтения ухода.', save: 'Сохранить профиль',
            tipsLabel: 'СОВЕТЫ ПО ФОТО', tipsTitle: 'Как улучшить анализ', tipsHelp: 'Чёткие фотографии при хорошем освещении помогают точнее найти проблемы.',
            tip1: 'Снимайте повреждённый лист крупным планом.', tip2: 'Используйте естественный свет без резких теней.', tip3: 'По возможности покажите всё растение.',
            saved: 'Профиль сохранён.', preferenceSaved: 'Настройка сохранена.', signedOut: 'Вы вышли из аккаунта.', savedConversation: 'СОХРАНЁННЫЙ ДИАЛОГ', noConversation: 'Для этой проверки нет сохранённых сообщений.', thinking: 'PlantCare думает', thinkingReview: 'Проверяем контекст растения', thinkingPrepare: 'Готовим полезный совет'
        },
        uz: {
            workspace: 'Ish maydoni', dashboard: 'Bosh sahifa', history: 'Tarix', account: 'Hisob', profile: 'Profilim', settings: 'Sozlamalar',
            helpTitle: 'Yordam kerakmi?', helpText: 'O‘simliklarni yaxshi suratga olishni o‘rganing.', photoTips: 'Surat bo‘yicha maslahatlar →',
            signIn: 'Kirish', signOut: 'Chiqish', guest: 'Mehmon', signInSave: 'Tahlillarni saqlash uchun kiring', plantEnthusiast: 'O‘simlik ishqibozi',
            date: '2026-YIL 24-SENTYABR, PAYSHANBA', goodMorning: 'Xayrli tong,', there: 'do‘st', welcome: 'O‘simliklaringizni sog‘lom saqlaylik.', newScan: '＋ Yangi tahlil',
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
            email: 'Email', password: 'Parol', create: 'Hisob yaratish', needAccount: 'Hisobingiz yo‘qmi? Yaratish', alreadyAccount: 'Hisobingiz bormi? Kirish',
            profileEdit: 'Profilni tahrirlash', profileHelp: 'Shaxsiy ma’lumot va parvarish afzalliklarini yangilang.', save: 'Profilni saqlash',
            tipsLabel: 'SURAT MASLAHATLARI', tipsTitle: 'Yaxshiroq tahlil oling', tipsHelp: 'Aniq va yaxshi yoritilgan suratlar muammolarni yaxshiroq aniqlashga yordam beradi.',
            tip1: 'Zararlangan bargni yaqindan suratga oling.', tip2: 'Tabiiy yorug‘likdan foydalaning.', tip3: 'Imkon bo‘lsa, butun o‘simlikni ko‘rsating.',
            saved: 'Profil saqlandi.', preferenceSaved: 'Sozlama saqlandi.', signedOut: 'Hisobdan chiqdingiz.', savedConversation: 'SAQLANGAN SUHBAT', noConversation: 'Bu tekshiruv uchun saqlangan xabarlar yo‘q.', thinking: 'PlantCare o‘ylamoqda', thinkingReview: 'O‘simlik ma’lumotlari ko‘rib chiqilmoqda', thinkingPrepare: 'Foydali maslahat tayyorlanmoqda'
        }
    };
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];
    const fileInput = $('#file-input');
    const dropZone = $('#drop-zone');
    const selectedFiles = $('#selected-files');
    const analyzeButton = $('#analyze-button');
    const chatInput = $('#chat-input');
    const sendButton = $('#chat-form button');

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
        try { data = await response.json(); } catch (_) {}
        if (!response.ok) {
            const detail = data.error || data.detail || Object.values(data).flat().join(' ') || 'Request failed.';
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
    function applyLanguage(language) {
        state.language = ['en', 'ru', 'uz'].includes(language) ? language : 'en';
        document.documentElement.lang = state.language;
        setText('.nav-label', 'workspace');
        setText('.nav-label-spaced', 'account');
        $('.nav-item[data-view="dashboard"]').innerHTML = `<span class="nav-icon">⌂</span>${t('dashboard')}`;
        $('.nav-item[data-view="history"]').innerHTML = `<span class="nav-icon">◷</span>${t('history')} <span class="nav-count" id="history-count">${state.diagnoses.length}</span>`;
        $('.nav-item[data-view="profile"]').innerHTML = `<span class="nav-icon">♙</span>${t('profile')}`;
        $('.nav-item[data-view="settings"]').innerHTML = `<span class="nav-icon">⚙</span>${t('settings')}`;
        setText('.help-card strong', 'helpTitle');
        setText('.help-card p', 'helpText');
        setText('#tips-button', 'photoTips');
        setText('.breadcrumb span', 'workspace');
        const activeView = $('.page-view.active')?.id?.replace('-view', '') || 'dashboard';
        setText('#page-kicker', activeView);
        setText('.eyebrow', 'date');
        if ($('.welcome-row h1')) $('.welcome-row h1').innerHTML = `${t('goodMorning')} <span id="welcome-name">${state.user ? (state.user.first_name || state.user.username) : t('there')}</span> <span>✦</span>`;
        setText('.welcome-row .subheading', 'welcome');
        setText('#new-scan-button', 'newScan');
        setText('.upload-panel .section-kicker', 'checkup');
        setText('.upload-panel h2', 'checkupQuestion');
        setText('.drop-zone h3', 'dropPhotos');
        setText('.drop-zone p button', 'browse');
        setText('.drop-zone small', 'fileHelp');
        setText('.upload-footer > span', 'private');
        setText('#analyze-button', 'analyze');
        setText('.recent-panel .section-kicker', 'yourPlants');
        setText('.recent-panel h2', 'recent');
        setText('.recent-panel .text-button', 'viewAll');
        setText('.insight-panel .section-kicker', 'currentInsight');
        setText('#result-title', 'noScan');
        setText('#result-status', 'waiting');
        setText('#result-placeholder h3', 'report', true);
        setText('#result-placeholder p', 'uploadHelp');
        setText('#view-report-button', 'viewReport');
        setText('.chat-heading h2', 'ask');
        setText('.chat-heading p', 'aiAdvice');
        setText('.chat-empty p', 'chatHelp', true);
        if ($('#chat-input')) $('#chat-input').placeholder = t('chatPlaceholder');
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
        $('#profile-experience-input').options[0].text = state.language === 'ru' ? 'Начинающий' : state.language === 'uz' ? 'Boshlang‘ich' : 'Beginner';
        $('#profile-experience-input').options[1].text = state.language === 'ru' ? 'Средний' : state.language === 'uz' ? 'O‘rta' : 'Intermediate';
        $('#profile-experience-input').options[2].text = state.language === 'ru' ? 'Продвинутый' : state.language === 'uz' ? 'Yuqori' : 'Advanced';
        setText('#profile-save', 'save');
        setText('#auth-modal .section-kicker', 'authLabel');
        setText('#auth-title', state.authMode === 'register' ? 'createAccount' : 'welcomeBack');
        setText('#auth-description', state.authMode === 'register' ? 'createHelp' : 'signInHelp');
        $$('#auth-form label').forEach((label) => {
            const input = label.querySelector('input');
            const key = input?.id === 'auth-first-name' ? 'firstName' : input?.id === 'auth-email' ? 'email' : input?.id === 'auth-password' ? 'password' : null;
            if (key) label.childNodes[0].textContent = `${t(key)} `;
        });
        setText('#auth-submit', state.authMode === 'register' ? 'create' : 'signIn');
        setText('#auth-switch', state.authMode === 'register' ? 'alreadyAccount' : 'needAccount');
        setText('#tips-modal .section-kicker', 'tipsLabel');
        setText('#tips-modal h2', 'tipsTitle');
        setText('#tips-modal > .tips-modal > p', 'tipsHelp');
        $$('.tips-list span').forEach((element, index) => element.textContent = t(`tip${index + 1}`));
        if ($('#preference-language')) $('#preference-language').value = state.language;
        if ($('#navbar-language')) $('#navbar-language').value = state.language;
        $('#sidebar-name').textContent = state.user ? (state.user.first_name || state.user.username) : t('guest');
        $('#sidebar-subtitle').textContent = state.user ? (state.user.email || t('plantEnthusiast')) : t('signInSave');
        $('#auth-button').textContent = state.user ? t('signOut') : t('signIn');
        $('#profile-meta').textContent = state.user ? state.user.email : t('guestProfile');
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
        $('#sidebar').classList.add('open');
        $('#mobile-overlay').classList.add('show');
    });
    $('#mobile-overlay').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
        $('#mobile-overlay').classList.remove('show');
    });
    $('#new-scan-button').addEventListener('click', () => {
        setView('dashboard');
        $('#upload-panel').scrollIntoView({behavior: 'smooth', block: 'center'});
    });
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
        if (valid.length !== incoming.length) showToast('Only image files under 10 MB can be added.');
        state.files = [...state.files, ...valid].slice(0, 5);
        if (incoming.length > 5 || valid.length + state.files.length > 5) showToast('You can analyze up to 5 photos at a time.');
        renderFiles();
    }
    $('#browse-button').addEventListener('click', (event) => { event.stopPropagation(); fileInput.click(); });
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
    ['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('dragging'); }));
    ['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('dragging'); }));
    dropZone.addEventListener('drop', (event) => addFiles(event.dataTransfer.files));
    function appendMessage(sender, text) {
        const chatBox = $('#chat-box');
        const empty = chatBox.querySelector('.chat-empty');
        if (empty) empty.remove();
        const message = document.createElement('div');
        message.className = `message ${sender}`;
        message.innerHTML = `<div class="message-bubble">${sender === 'ai' ? formatAssistantText(text) : escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
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
        return formatted || '🌱 I’m here to help with your plant.';
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
        $('#result-placeholder').classList.add('hidden');
        $('#result-content').classList.remove('hidden');
        $('#view-report-button').classList.remove('hidden');
        $('#result-title').textContent = diagnosis.plant_name || 'Plant scan';
        const disease = diagnosis.disease_detected || 'Analysis complete';
        const healthy = disease.toLowerCase().includes('healthy');
        $('#result-status').textContent = healthy ? t('healthy') : t('needsAttention');
        $('#result-status').className = `status-badge ${healthy ? 'healthy' : 'attention'}`;
        $('#result-disease').textContent = disease;
        $('#result-advice').textContent = diagnosis.treatment_advice || 'Review the full report for suggested next steps.';
        $('#result-image').src = diagnosis.image;
        $('#confidence-label').textContent = diagnosis.confidence ? `${Math.round(diagnosis.confidence * 100)}% match` : 'AI insight';
        chatInput.disabled = false;
        sendButton.disabled = false;
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
            appendMessage('ai', latest.messages?.[0]?.message || t('viewReport'));
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
    $('#chat-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (!message || !state.currentDiagnosisId) return;
        appendMessage('user', message);
        chatInput.value = '';
        sendButton.disabled = true;
        chatInput.disabled = true;
        showTypingIndicator();
        try {
            const data = await apiFetch('/api/chat/', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({diagnosis_id: state.currentDiagnosisId, message, language: state.language || 'en'})});
            hideTypingIndicator();
            appendMessage('ai', data.reply);
        } catch (error) {
            hideTypingIndicator();
            appendMessage('ai', error.message);
        } finally {
            sendButton.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    });
    async function loadHistory() {
        try { state.diagnoses = await apiFetch('/api/history/'); }
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
            beginner: state.language === 'ru' ? 'Начинающий' : state.language === 'uz' ? 'Boshlang‘ich' : 'Beginner',
            intermediate: state.language === 'ru' ? 'Средний' : state.language === 'uz' ? 'O‘rta' : 'Intermediate',
            advanced: state.language === 'ru' ? 'Продвинутый' : state.language === 'uz' ? 'Yuqori' : 'Advanced',
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
    function isHealthy(diagnosis) { return (diagnosis.disease_detected || '').toLowerCase().includes('healthy'); }
    function formatDate(date) { return new Date(date).toLocaleDateString({en: 'en-US', ru: 'ru-RU', uz: 'uz-UZ'}[state.language] || 'en-US', {month: 'short', day: 'numeric', year: 'numeric'}); }
    function diagnosisCard(diagnosis) {
        const healthy = isHealthy(diagnosis);
        return `<article class="history-card" data-diagnosis-id="${diagnosis.id}" tabindex="0" role="button" aria-label="${escapeHtml(diagnosis.plant_name || 'Plant checkup')}"><img src="${escapeHtml(diagnosis.image)}" alt="${escapeHtml(diagnosis.plant_name)}"><div class="history-card-body"><h3>${escapeHtml(diagnosis.plant_name || 'Unknown plant')}</h3><p>${escapeHtml(diagnosis.disease_detected || 'Analysis complete')}</p><div class="history-card-meta"><span>${formatDate(diagnosis.created_at)}</span><span class="status-badge ${healthy ? 'healthy' : 'attention'}">${healthy ? t('healthy') : t('needsAttention')}</span></div></div></article>`;
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
            if (state.user) diagnosis = await apiFetch(`/api/history/${diagnosisId}/`);
        } catch (error) {
            showToast(error.message);
            return;
        }
        const healthy = isHealthy(diagnosis);
        $('#history-chat-image').src = diagnosis.image;
        $('#history-chat-title').textContent = diagnosis.plant_name || 'Plant checkup';
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
        $('#recent-list').innerHTML = state.diagnoses.slice(0, 3).map((diagnosis) => `<div class="recent-row"><img src="${escapeHtml(diagnosis.image)}" alt=""><div><strong>${escapeHtml(diagnosis.plant_name || 'Unknown plant')}</strong><small>${escapeHtml(diagnosis.disease_detected || 'Analysis complete')} · ${formatDate(diagnosis.created_at)}</small></div></div>`).join('') || `<div class="empty-state small"><span>✿</span><p>${t('historyHelp')}</p></div>`;
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
        $('#welcome-name').textContent = user ? name : 'there';
        $('#profile-name').textContent = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username : 'Guest user';
        $('#profile-meta').textContent = user ? user.email : 'Create an account to keep your plant history.';
        $('#auth-button').textContent = user ? 'Sign out' : 'Sign in';
        $('#profile-auth-button').textContent = user ? 'Edit profile' : 'Sign in to edit profile';
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
        try { await apiFetch('/api/auth/logout/', {method: 'POST'}); setUser(null); state.diagnoses = []; updateCounts(); updateRecent(); showToast('You have been signed out.'); }
        catch (error) { showToast(error.message); }
    });
    $('#profile-auth-button').addEventListener('click', () => {
        if (!state.user) return openAuth();
        if (!state.profile) return showToast('Profile data is still loading.');
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
            showToast(register ? 'Account created.' : 'Welcome back.');
        } catch (error) { showToast(error.message); }
        finally { $('#auth-submit').disabled = false; }
    });
    $$('.toggle[data-preference]').forEach((toggle) => toggle.addEventListener('change', async () => {
        if (!state.user) return showToast('Sign in to save preferences.');
        try { await apiFetch('/api/preferences/', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({[toggle.dataset.preference]: toggle.checked})}); showToast('Preference saved.'); }
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
        if (!state.user) return showToast(t('preferenceSaved'));
        try {
            await apiFetch('/api/preferences/', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({language})});
            showToast(t('preferenceSaved'));
        } catch (error) {
            showToast(error.message);
        }
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
        if (state.user) await loadAccountData();
        else applyLanguage(state.language);
    }
    init();
})();
