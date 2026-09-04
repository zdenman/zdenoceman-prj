// Alcohol BAC info page
(function () {
    'use strict';

    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];

    const FALLBACK = {
        en: {
            language: 'Language:',
            language_select: 'Select language',
            back_to_grid: 'Back to tools',
            alc_info_back: 'Back to BAC calculator',
            alc_info_title: 'How the BAC calculator works',
            alc_info_acronym: 'BAC = Blood Alcohol Concentration / concentration of alcohol in blood',
            alc_info_intro: 'A practical explanation of what BAC means, what the calculator estimates, which formula it uses, and why the number can still rise for a while after your last drink.',
            alc_info_callout: 'Important: this page explains the estimate, not a legal guarantee. Never use it as the only reason to decide that driving is safe.',
            alc_info_basics_title: 'What the calculator estimates',
            alc_info_basics_p1: 'The calculator estimates blood alcohol concentration in ‰ from the drinks you entered, your body weight, your selected sex factor, and the time when each drink was consumed.',
            alc_info_basics_p2: 'It does not measure real alcohol in your body. It builds a model: how much pure alcohol likely entered your blood, how quickly it is absorbed, and how fast the body removes it over time.',
            alc_info_formula_title: 'Method and formula',
            alc_info_formula_p1: 'For each drink, the calculator first converts the drink into grams of pure alcohol, then estimates the peak contribution to BAC using a Widmark-style formula.',
            alc_info_formula_p2: 'The factor r is set lower for women than for men, because the standard Widmark estimate assumes a lower distribution factor. In this app, that means women will usually get a higher estimated BAC from the same drink intake and body weight.',
            alc_info_rising_title: 'Why BAC can be low first and higher later',
            alc_info_rising_p1: 'Alcohol is not in your blood at full strength the second you finish a drink. There is an absorption phase. In the calculator, alcohol rises gradually for about 30 minutes without food and about 60 minutes if you selected that you ate.',
            alc_info_rising_p2: 'That is why you can drink a shot now, see a lower BAC immediately, and then see a higher BAC 10 to 30 minutes later. The body may still be absorbing alcohol faster than it can eliminate it.',
            alc_info_zero_title: 'How the sober time is calculated',
            alc_info_zero_p1: 'The app simulates all entered drinks together on one shared BAC curve. Each drink adds alcohol gradually, but elimination happens once from the total BAC, not separately for each drink.',
            alc_info_zero_p2: 'After the last drink reaches its peak, the curve only goes down. The sober-at time is the point where the simulated BAC drops back to 0.00 ‰.',
            alc_info_inputs_title: 'What changes the result',
            alc_info_input_1: 'Higher volume or higher ABV means more pure alcohol and a higher BAC.',
            alc_info_input_2: 'Lower body weight means less distribution volume and a higher BAC.',
            alc_info_input_3: 'Selecting food slows the rise, so the peak comes later.',
            alc_info_input_4: 'Multiple drinks close together stack on top of each other and extend the sober time.',
            alc_info_input_5: 'The future time check uses the same curve, so you can compare now vs later.',
            alc_info_limits_title: 'What the calculator does not know',
            alc_info_limit_1: 'Your real metabolism may be slower or faster than the average 0.15 ‰ per hour.',
            alc_info_limit_2: 'The app does not know your age, liver condition, medication, fatigue, hydration, or drinking history.',
            alc_info_limit_3: 'Food is simplified into one slower absorption option. Real digestion is more complex.',
            alc_info_limit_4: 'Because of that, the result is educational and approximate, not proof that you are safe to drive.'
        },
        sk: {
            language: 'Jazyk:',
            language_select: 'Vybrať jazyk',
            back_to_grid: 'Späť na nástroje',
            alc_info_back: 'Späť na BAC kalkulačku',
            alc_info_title: 'Ako funguje BAC kalkulačka',
            alc_info_acronym: 'BAC = Blood Alcohol Concentration / koncentrácia alkoholu v krvi',
            alc_info_intro: 'Praktické vysvetlenie toho, čo znamená skratka BAC, čo kalkulačka odhaduje, aký vzorec používa a prečo môže hodnota po poslednom drinku ešte chvíľu rásť.',
            alc_info_callout: 'Dôležité: táto stránka vysvetľuje odhad, nie právnu záruku. Nikdy ju nepoužívaj ako jediný dôvod, že je šoférovanie bezpečné.',
            alc_info_basics_title: 'Čo kalkulačka odhaduje',
            alc_info_basics_p1: 'Kalkulačka odhaduje koncentráciu alkoholu v krvi v ‰ podľa nápojov, ktoré si zadal, tvojej hmotnosti, zvoleného pohlavného faktora a času, kedy bol každý nápoj vypitý.',
            alc_info_basics_p2: 'Nemeriá reálny alkohol v tele. Vytvára model: koľko čistého alkoholu sa pravdepodobne dostalo do krvi, ako rýchlo sa vstrebáva a ako rýchlo ho telo v čase odbúrava.',
            alc_info_formula_title: 'Metóda a vzorec',
            alc_info_formula_p1: 'Pri každom nápoji kalkulačka najprv prepočíta nápoj na gramy čistého alkoholu a potom odhadne jeho vrcholový príspevok k BAC pomocou vzorca typu Widmark.',
            alc_info_formula_p2: 'Faktor r je nastavený nižšie pre ženy než pre mužov, pretože štandardný Widmarkov odhad predpokladá nižší distribučný faktor. V aplikácii to znamená, že ženy pri rovnakom množstve alkoholu a hmotnosti zvyčajne dostanú vyšší odhad BAC.',
            alc_info_rising_title: 'Prečo môže byť BAC najprv nižšie a neskôr vyššie',
            alc_info_rising_p1: 'Alkohol nie je v krvi na plnej úrovni hneď po dopití. Existuje fáza vstrebávania. V kalkulačke hladina rastie postupne asi 30 minút bez jedla a asi 60 minút, ak si označil, že si jedol.',
            alc_info_rising_p2: 'Preto môžeš vypiť shot teraz, hneď vidieť nižšie BAC a o 10 až 30 minút neskôr vyššie BAC. Telo ešte môže vstrebávať alkohol rýchlejšie, než ho stíha odbúravať.',
            alc_info_zero_title: 'Ako sa počíta čas vytriezvenia',
            alc_info_zero_p1: 'Aplikácia simuluje všetky zadané nápoje spoločne na jednej krivke BAC. Každý nápoj pridáva alkohol postupne, ale odbúravanie prebieha len raz z celkového BAC, nie zvlášť pre každý nápoj.',
            alc_info_zero_p2: 'Po tom, čo posledný nápoj dosiahne svoj vrchol, krivka už len klesá. Čas triezvy o je moment, keď simulované BAC klesne späť na 0.00 ‰.',
            alc_info_inputs_title: 'Čo mení výsledok',
            alc_info_input_1: 'Vyšší objem alebo vyššie percento alkoholu znamená viac čistého alkoholu a vyššie BAC.',
            alc_info_input_2: 'Nižšia hmotnosť znamená menší distribučný objem a vyššie BAC.',
            alc_info_input_3: 'Voľba jedla spomalí rast, takže vrchol príde neskôr.',
            alc_info_input_4: 'Viaceré nápoje blízko pri sebe sa sčítajú a predĺžia čas vytriezvenia.',
            alc_info_input_5: 'Kontrola budúceho času používa tú istú krivku, takže vieš porovnať stav teraz a neskôr.',
            alc_info_limits_title: 'Čo kalkulačka nevie',
            alc_info_limit_1: 'Tvoj skutočný metabolizmus môže byť pomalší alebo rýchlejší než priemer 0.15 ‰ za hodinu.',
            alc_info_limit_2: 'Aplikácia nepozná tvoj vek, stav pečene, lieky, únavu, hydratáciu ani históriu pitia.',
            alc_info_limit_3: 'Jedlo je zjednodušené len na jednu pomalšiu voľbu vstrebávania. Skutočné trávenie je zložitejšie.',
            alc_info_limit_4: 'Preto je výsledok orientačný a vzdelávací, nie dôkaz, že je bezpečné šoférovať.'
        },
        sr: {
            language: 'Jezik:',
            language_select: 'Izaberi jezik',
            back_to_grid: 'Nazad na alate',
            alc_info_back: 'Nazad na BAC kalkulator',
            alc_info_title: 'Kako radi BAC kalkulator',
            alc_info_acronym: 'BAC = Blood Alcohol Concentration / koncentracija alkohola u krvi',
            alc_info_intro: 'Praktično objašnjenje šta znači skraćenica BAC, šta kalkulator procjenjuje, koju formulu koristi i zašto broj može još neko vrijeme rasti nakon poslednjeg pića.',
            alc_info_callout: 'Važno: ova stranica objašnjava procjenu, a ne pravnu garanciju. Nikada je nemoj koristiti kao jedini razlog da procijeniš da je vožnja sigurna.',
            alc_info_basics_title: 'Šta kalkulator procjenjuje',
            alc_info_basics_p1: 'Kalkulator procjenjuje koncentraciju alkohola u krvi u ‰ na osnovu pića koja si unio, tvoje težine, izabranog polnog faktora i vremena kada je svako piće popijeno.',
            alc_info_basics_p2: 'Ne mjeri stvarni alkohol u tijelu. Pravi model: koliko je čistog alkohola vjerovatno ušlo u krv, koliko brzo se apsorbuje i kojom brzinom ga tijelo uklanja tokom vremena.',
            alc_info_formula_title: 'Metoda i formula',
            alc_info_formula_p1: 'Za svako piće kalkulator prvo pretvara unos u grame čistog alkohola, a zatim procjenjuje vršni doprinos BAC-u pomoću formule tipa Widmark.',
            alc_info_formula_p2: 'Faktor r je postavljen niže za žene nego za muškarce, jer standardna Widmark procjena pretpostavlja niži distribucioni faktor. U aplikaciji to znači da će žene za istu količinu alkohola i istu težinu obično dobiti viši procijenjeni BAC.',
            alc_info_rising_title: 'Zašto BAC može prvo biti niži pa kasnije veći',
            alc_info_rising_p1: 'Alkohol nije u krvi punom snagom odmah nakon što završiš piće. Postoji faza apsorpcije. U kalkulatoru nivo raste postepeno oko 30 minuta bez hrane i oko 60 minuta ako si označio da si jeo.',
            alc_info_rising_p2: 'Zato možeš popiti šot sada, odmah vidjeti niži BAC, a 10 do 30 minuta kasnije viši BAC. Tijelo još može apsorbovati alkohol brže nego što ga eliminiše.',
            alc_info_zero_title: 'Kako se računa vrijeme otrežnjenja',
            alc_info_zero_p1: 'Aplikacija simulira sva unijeta pića zajedno na jednoj BAC krivi. Svako piće dodaje alkohol postepeno, ali se eliminacija računa samo jednom iz ukupnog BAC-a, a ne posebno za svako piće.',
            alc_info_zero_p2: 'Nakon što poslednje piće dostigne vrh, kriva samo opada. Vrijeme trijezan u je trenutak kada simulirani BAC padne nazad na 0.00 ‰.',
            alc_info_inputs_title: 'Šta mijenja rezultat',
            alc_info_input_1: 'Veći volumen ili veći procenat alkohola znači više čistog alkohola i viši BAC.',
            alc_info_input_2: 'Manja težina znači manji distribucioni volumen i viši BAC.',
            alc_info_input_3: 'Izbor hrane usporava rast, pa vrh dolazi kasnije.',
            alc_info_input_4: 'Više pića popijenih blizu jedno drugom sabiraju se i produžavaju vrijeme otrežnjenja.',
            alc_info_input_5: 'Provjera budućeg vremena koristi istu krivu, pa možeš uporediti stanje sada i kasnije.',
            alc_info_limits_title: 'Šta kalkulator ne zna',
            alc_info_limit_1: 'Tvoj stvarni metabolizam može biti sporiji ili brži od prosjeka od 0.15 ‰ na sat.',
            alc_info_limit_2: 'Aplikacija ne zna tvoje godine, stanje jetre, lijekove, umor, hidrataciju ni istoriju pijenja.',
            alc_info_limit_3: 'Hrana je pojednostavljena na samo jednu sporiju opciju apsorpcije. Prava probava je složenija.',
            alc_info_limit_4: 'Zato je rezultat informativan i približan, a ne dokaz da je bezbjedno voziti.'
        }
    };

    let strings = FALLBACK.en;
    let currentLang = 'en';

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (strings[key] !== undefined) el.textContent = strings[key];
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-aria-label');
            if (strings[key] !== undefined) el.setAttribute('aria-label', strings[key]);
        });
        document.documentElement.lang = currentLang;
        document.title = strings.alc_info_title || 'How the BAC calculator works';
        var langSel = document.getElementById('language-select');
        if (langSel) langSel.value = currentLang;
    }

    function loadLang(lang) {
        currentLang = lang;
        strings = FALLBACK[lang] || FALLBACK.en;
        applyTranslations();

        const controller = new AbortController();
        const tid = setTimeout(function () { controller.abort(); }, 4000);
        fetch('./translations/' + lang + '.json', { signal: controller.signal })
            .then(function (r) { clearTimeout(tid); if (!r.ok) throw new Error(); return r.json(); })
            .then(function (data) {
                strings = Object.assign({}, strings, data);
                applyTranslations();
            })
            .catch(function () { clearTimeout(tid); });
    }

    function detectLang() {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;

        const preferredLanguages = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || 'en'];

        for (const language of preferredLanguages) {
            const langCode = String(language || '').toLowerCase().split('-')[0];
            if (SUPPORTED_LANGUAGES.includes(langCode)) return langCode;
        }

        return 'en';
    }

    loadLang(detectLang());

    var languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function (e) {
            var lang = e.target.value;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            loadLang(lang);
        });
    }
})();
