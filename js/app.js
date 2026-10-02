(function () {

    "use strict";

    var budget = {
        income: {
            salary: 0,
            extra: 0,
            other: 0
        },

        fixed: {
            rent: 0,
            electricity: 0,
            water: 0,
            gas: 0,
            internet: 0,
            phone: 0
        },

        variable: {
            market: 0,
            transport: 0,
            food: 0,
            education: 0,
            health: 0,
            entertainment: 0,
            subscriptions: 0,
            other: 0
        },

        goal: {
            enabled: false,
            amount: 0,
            months: 0
        }
    };


    /* =========================
       YARDIMCI FONKSİYONLAR
       ========================= */

    function number(value) {
        value = String(value || "").replace(",", ".");

        var result = parseFloat(value);

        if (isNaN(result) || result < 0) {
            return 0;
        }

        return result;
    }


    function money(value) {
        return Number(value || 0).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " TL";
    }


    function getValue(id) {
        var element = document.getElementById(id);

        if (!element) {
            return 0;
        }

        return number(element.value);
    }


    /* =========================
       CSS
       ========================= */

    function budgetStyles() {

        return `
        <style>

        .budget-page {
            min-height:100vh;
            padding:18px 16px 35px;
            background:
                radial-gradient(
                    circle at 50% -10%,
                    rgba(32,213,195,.13),
                    transparent 38%
                ),
                #05090b;
        }

        .budget-top {
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:18px;
        }

        .budget-back {
            width:40px;
            height:40px;
            border:1px solid #173c40;
            border-radius:12px;
            background:#081214;
            color:#b9d0d2;
            font-size:19px;
        }

        .budget-step {
            color:#20d5c3;
            font-size:11px;
            font-weight:700;
            letter-spacing:1px;
        }

        .budget-header {
            margin-bottom:22px;
        }

        .budget-header-label {
            color:#20d5c3;
            font-size:10px;
            font-weight:700;
            letter-spacing:1.8px;
            margin-bottom:8px;
        }

        .budget-header-title {
            font-size:27px;
            font-weight:800;
            line-height:1.15;
        }

        .budget-header-text {
            margin-top:8px;
            color:#7f979a;
            font-size:13px;
            line-height:1.5;
        }

        .progress {
            display:flex;
            gap:5px;
            margin-top:17px;
        }

        .progress-line {
            height:4px;
            flex:1;
            border-radius:10px;
            background:#173136;
        }

        .progress-line.active {
            background:#20d5c3;
            box-shadow:0 0 8px rgba(32,213,195,.35);
        }

        .budget-section {
            margin-top:15px;
            padding:17px;
            border:1px solid #143b3f;
            border-radius:18px;
            background:
                linear-gradient(
                    145deg,
                    #0a1719,
                    #071012
                );
        }

        .budget-section-head {
            display:flex;
            align-items:center;
            gap:12px;
            margin-bottom:15px;
        }

        .budget-section-number {
            width:36px;
            height:36px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-shrink:0;
            border-radius:11px;
            background:#0b292c;
            color:#20d5c3;
            font-size:11px;
            font-weight:800;
        }

        .budget-section-title {
            font-size:15px;
            font-weight:800;
        }

        .budget-section-subtitle {
            margin-top:3px;
            color:#647c7f;
            font-size:10px;
        }

        .budget-input {
            margin-bottom:10px;
        }

        .budget-input:last-child {
            margin-bottom:0;
        }

        .budget-input label {
            display:block;
            margin-bottom:6px;
            color:#91a9ab;
            font-size:11px;
            font-weight:600;
        }

        .budget-input-wrap {
            position:relative;
        }

        .budget-input input {
            width:100%;
            height:48px;
            padding:0 48px 0 14px;
            border:1px solid #183c40;
            border-radius:12px;
            outline:none;
            background:#061012;
            color:#ffffff;
            font-size:15px;
        }

        .budget-input input:focus {
            border-color:#20d5c3;
            box-shadow:0 0 0 2px rgba(32,213,195,.08);
        }

        .budget-input-unit {
            position:absolute;
            right:13px;
            top:50%;
            transform:translateY(-50%);
            color:#4e777a;
            font-size:11px;
        }

        .budget-total {
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-top:14px;
            padding-top:13px;
            border-top:1px solid #123136;
        }

        .budget-total-label {
            color:#6f878a;
            font-size:11px;
        }

        .budget-total-value {
            color:#20d5c3;
            font-size:14px;
            font-weight:800;
        }

        .goal-info {
            margin-top:12px;
            padding:12px;
            border-radius:12px;
            background:#071d1f;
            border:1px solid #123f42;
            color:#799496;
            font-size:11px;
            line-height:1.5;
        }

        .calculate-button {
            width:100%;
            margin-top:20px;
            padding:17px;
            border:0;
            border-radius:15px;
            background:linear-gradient(
                135deg,
                #20d5c3,
                #11aaa0
            );
            color:#031010;
            font-size:15px;
            font-weight:800;
            box-shadow:
                0 10px 28px rgba(32,213,195,.16);
        }

        .calculate-button:active {
            transform:scale(.985);
        }

        .budget-note {
            margin-top:11px;
            text-align:center;
            color:#4d6568;
            font-size:9px;
            line-height:1.5;
        }

        /* AKILLI ANALİZ */

        .budget-analysis {
            margin-top:15px;
            padding:19px;
            border:1px solid #20575a;
            border-radius:18px;
            background:
                linear-gradient(
                    145deg,
                    #091b1d,
                    #071214
                );
        }

        .analysis-label {
            color:#20d5c3;
            font-size:10px;
            font-weight:800;
            letter-spacing:1.5px;
        }

        .analysis-title {
            margin-top:9px;
            color:#e2f0f0;
            font-size:18px;
            font-weight:800;
            line-height:1.3;
        }

        .analysis-text {
            margin-top:9px;
            color:#839a9d;
            font-size:12px;
            line-height:1.65;
        }

        .analysis-daily {
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
            margin-top:15px;
            padding-top:13px;
            border-top:1px solid #15383b;
            color:#71888b;
            font-size:10px;
        }

        .analysis-daily strong {
            color:#20d5c3;
            font-size:13px;
        }

        .budget-analysis.danger {
            border-color:#674044;
        }

        .budget-analysis.warning {
            border-color:#5d5232;
        }

        .budget-analysis.good {
            border-color:#20575a;
        }

        .budget-analysis.excellent {
            border-color:#27635e;
        }

        .budget-analysis.neutral {
            border-color:#31484b;
        }

        .goal-analysis {
            margin-top:12px;
            padding:16px;
            border:1px solid #263f43;
            border-radius:16px;
            background:#081315;
        }

        .goal-analysis-title {
            color:#dceeed;
            font-size:13px;
            font-weight:800;
        }

        .goal-analysis-text {
            margin-top:7px;
            color:#71898b;
            font-size:11px;
            line-height:1.55;
        }

        .smart-use {
            margin-top:12px;
            padding:16px;
            border-radius:16px;
            border:1px solid #153d40;
            background:#071416;
        }

        .smart-use-title {
            color:#cce5e5;
            font-size:13px;
            font-weight:800;
        }

        .smart-use-text {
            margin-top:7px;
            color:#728a8d;
            font-size:11px;
            line-height:1.6;
        }


        /* SONUÇ */

        .result-page {
            min-height:100vh;
            padding:20px 16px 35px;
            background:
                radial-gradient(
                    circle at 50% 0%,
                    rgba(32,213,195,.13),
                    transparent 40%
                ),
                #05090b;
        }

        .result-hero {
            padding:22px;
            border:1px solid #1b5a59;
            border-radius:20px;
            background:#081719;
            text-align:center;
        }

        .result-label {
            color:#719092;
            font-size:11px;
        }

        .result-main {
            margin-top:9px;
            color:#20d5c3;
            font-size:30px;
            font-weight:800;
        }

        .result-description {
            margin-top:7px;
            color:#81999b;
            font-size:12px;
            line-height:1.5;
        }

        .result-grid {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
            margin-top:14px;
        }

        .result-box {
            padding:15px;
            border:1px solid #14373b;
            border-radius:15px;
            background:#091417;
        }

        .result-box-title {
            color:#61797c;
            font-size:10px;
        }

        .result-box-value {
            margin-top:6px;
            color:#d8eeee;
            font-size:14px;
            font-weight:800;
        }

        .distribution {
            margin-top:15px;
            padding:17px;
            border:1px solid #143b3f;
            border-radius:18px;
            background:#091417;
        }

        .distribution-title {
            font-size:15px;
            font-weight:800;
        }

        .distribution-subtitle {
            margin-top:5px;
            color:#667e80;
            font-size:11px;
            line-height:1.4;
        }

        .distribution-row {
            margin-top:13px;
        }

        .distribution-head {
            display:flex;
            justify-content:space-between;
            margin-bottom:6px;
            font-size:11px;
        }

        .distribution-name {
            color:#8da5a7;
        }

        .distribution-value {
            color:#20d5c3;
            font-weight:700;
        }

        .distribution-bar {
            height:6px;
            border-radius:10px;
            overflow:hidden;
            background:#10272a;
        }

        .distribution-fill {
            height:100%;
            border-radius:10px;
            background:#20d5c3;
        }

        .new-budget-button {
            width:100%;
            margin-top:18px;
            padding:16px;
            border:1px solid #20575a;
            border-radius:14px;
            background:#081719;
            color:#20d5c3;
            font-weight:800;
        }

        </style>
        `;
    }


    /* =========================
       INPUT
       ========================= */

    function input(id, title, placeholder) {

        return `
        <div class="budget-input">

            <label for="${id}">
                ${title}
            </label>

            <div class="budget-input-wrap">

                <input
                    id="${id}"
                    type="number"
                    inputmode="decimal"
                    min="0"
                    placeholder="${placeholder || "0"}"
                >

                <span class="budget-input-unit">
                    TL
                </span>

            </div>

        </div>
        `;
    }


    /* =========================
       BÖLÜM
       ========================= */

    function section(numberText, title, subtitle, content) {

        return `
        <section class="budget-section">

            <div class="budget-section-head">

                <div class="budget-section-number">
                    ${numberText}
                </div>

                <div>

                    <div class="budget-section-title">
                        ${title}
                    </div>

                    <div class="budget-section-subtitle">
                        ${subtitle}
                    </div>

                </div>

            </div>

            ${content}

        </section>
        `;
    }


    /* =========================
       TOPLAM
       ========================= */

    function totalLine(id, label) {

        return `
        <div class="budget-total">

            <div class="budget-total-label">
                ${label}
            </div>

            <div
                id="${id}"
                class="budget-total-value">
                0,00 TL
            </div>

        </div>
        `;
    }


    /* =========================
       BÜTÇE EKRANI
       ========================= */

    function openBudget() {

        document.body.innerHTML = budgetStyles() + `

        <div class="budget-page">

            <div class="budget-top">

                <button
                    class="budget-back"
                    onclick="location.reload()">
                    ‹
                </button>

                <div class="budget-step">
                    ADIM 1 / 4
                </div>

            </div>


            <div class="budget-header">

                <div class="budget-header-label">
                    BÜTÇE OLUŞTURMA
                </div>

                <div class="budget-header-title">
                    Bütçeni<br>
                    <span style="color:#20d5c3">
                        birlikte oluşturalım.
                    </span>
                </div>

                <div class="budget-header-text">
                    Aylık gelir ve giderlerini gir.
                    BütçePilot kalan paranı ve hedeflerini
                    senin için hesaplayacak.
                </div>

                <div class="progress">

                    <div class="progress-line active"></div>
                    <div class="progress-line"></div>
                    <div class="progress-line"></div>
                    <div class="progress-line"></div>

                </div>

            </div>


            ${section(
                "01",
                "Gelirlerin",
                "Bu ay eline geçen toplam para",
                input("salary", "Maaş", "35.000") +
                input("extra", "Ek gelir", "3.000") +
                input("incomeOther", "Diğer gelir", "2.000") +
                totalLine("incomeTotal", "Toplam gelir")
            )}


            ${section(
                "02",
                "Sabit giderlerin",
                "Her ay düzenli olarak ödediğin giderler",
                input("rent", "Kira", "12.000") +
                input("electricity", "Elektrik", "1.200") +
                input("water", "Su", "400") +
                input("gas", "Doğalgaz", "1.500") +
                input("internet", "İnternet", "500") +
                input("phone", "Telefon", "400") +
                totalLine("fixedTotal", "Toplam sabit gider")
            )}


            ${section(
                "03",
                "Değişken giderlerin",
                "Ay içinde değişebilen harcamaların",
                input("market", "Market", "2.000") +
                input("transport", "Ulaşım", "1.000") +
                input("food", "Yemek", "1.500") +
                input("education", "Eğitim", "500") +
                input("health", "Sağlık", "500") +
                input("entertainment", "Eğlence", "1.000") +
                input("subscriptions", "Abonelikler", "500") +
                input("variableOther", "Diğer", "2.000") +
                totalLine("variableTotal", "Toplam değişken gider")
            )}


            ${section(
                "04",
                "Birikim hedefin",
                "Belirli bir tarihe kadar ulaşmak istediğin hedef",
                input("daysUntilSalary", "Bir sonraki maaşa kaç gün var?", "20") +
                input("goalAmount", "Hedef tutarı", "20.000") +
                input("goalMonths", "Kaç ayda?", "3") +

                `
                <div class="goal-info">
                    Hedefini girersen BütçePilot her ay
                    ne kadar ayırman gerektiğini hesaplar.
                </div>
                `
            )}


            <button
                id="calculateButton"
                class="calculate-button"
                type="button">

                Bütçemi Hesapla →
                
            </button>

            <div class="budget-note">
                Bu dağılım genel bir bütçe planlama önerisidir.
                Yatırım veya finansal ürün tavsiyesi değildir.
            </div>

        </div>
        `;


        updateLiveTotals();


        document
            .getElementById("calculateButton")
            .addEventListener("click", calculateBudget);


        var inputs = document.querySelectorAll(
            ".budget-input input"
        );

        inputs.forEach(function (element) {

            element.addEventListener(
                "input",
                updateLiveTotals
            );

        });

    }


    /* =========================
       CANLI TOPLAMLAR
       ========================= */

    function updateLiveTotals() {

        var income =
            getValue("salary") +
            getValue("extra") +
            getValue("incomeOther");

        var fixed =
            getValue("rent") +
            getValue("electricity") +
            getValue("water") +
            getValue("gas") +
            getValue("internet") +
            getValue("phone");

        var variable =
            getValue("market") +
            getValue("transport") +
            getValue("food") +
            getValue("education") +
            getValue("health") +
            getValue("entertainment") +
            getValue("subscriptions") +
            getValue("variableOther");


        var incomeElement =
            document.getElementById("incomeTotal");

        var fixedElement =
            document.getElementById("fixedTotal");

        var variableElement =
            document.getElementById("variableTotal");


        if (incomeElement) {
            incomeElement.textContent = money(income);
        }

        if (fixedElement) {
            fixedElement.textContent = money(fixed);
        }

        if (variableElement) {
            variableElement.textContent = money(variable);
        }

    }


    /* =========================
       VERİLERİ OKU
       ========================= */

    function readBudget() {

        budget.income.salary =
            getValue("salary");

        budget.income.extra =
            getValue("extra");

        budget.income.other =
            getValue("incomeOther");


        budget.fixed.rent =
            getValue("rent");

        budget.fixed.electricity =
            getValue("electricity");

        budget.fixed.water =
            getValue("water");

        budget.fixed.gas =
            getValue("gas");

        budget.fixed.internet =
            getValue("internet");

        budget.fixed.phone =
            getValue("phone");


        budget.variable.market =
            getValue("market");

        budget.variable.transport =
            getValue("transport");

        budget.variable.food =
            getValue("food");

        budget.variable.education =
            getValue("education");

        budget.variable.health =
            getValue("health");

        budget.variable.entertainment =
            getValue("entertainment");

        budget.variable.subscriptions =
            getValue("subscriptions");

        budget.variable.other =
            getValue("variableOther");


        budget.goal.amount =
            getValue("goalAmount");

        budget.goal.months =
            getValue("goalMonths");

        budget.goal.enabled =
            budget.goal.amount > 0 &&
            budget.goal.months > 0;


        /* Bir sonraki maaşa kalan gün */
        budget.daysUntilSalary =
            Math.max(
                1,
                Math.floor(
                    getValue("daysUntilSalary")
                )
            );

    }


    /* =========================
       TOPLAMLAR
       ========================= */

    function totalIncome() {

        return (
            budget.income.salary +
            budget.income.extra +
            budget.income.other
        );

    }


    function totalFixed() {

        return (
            budget.fixed.rent +
            budget.fixed.electricity +
            budget.fixed.water +
            budget.fixed.gas +
            budget.fixed.internet +
            budget.fixed.phone
        );

    }


    function totalVariable() {

        return (
            budget.variable.market +
            budget.variable.transport +
            budget.variable.food +
            budget.variable.education +
            budget.variable.health +
            budget.variable.entertainment +
            budget.variable.subscriptions +
            budget.variable.other
        );

    }


    /* =========================
       HESAPLA
       ========================= */

    function calculateBudget() {

        readBudget();

        var income = totalIncome();

        var fixed = totalFixed();

        var variable = totalVariable();

        var expenses = fixed + variable;

        var available = income - expenses;

        var monthlyGoal = 0;

        if (
            budget.goal.enabled &&
            budget.goal.months > 0
        ) {
            monthlyGoal =
                budget.goal.amount /
                budget.goal.months;
        }

        var afterGoal =
            available - monthlyGoal;


        showResult(
            income,
            fixed,
            variable,
            expenses,
            available,
            monthlyGoal,
            afterGoal
        );

        if (typeof bpSaveBudgetHistory === "function") {
            bpSaveBudgetHistory(
                income,
                fixed,
                variable,
                expenses,
                available,
                monthlyGoal,
                afterGoal
            );
        }

    }


    /* =========================
       AY SONU HESABI
       ========================= */

    function daysUntilMonthEnd() {

        /*
         * Kullanıcı bir sonraki maaşa kalan günü girdiyse
         * analiz artık ay sonuna göre değil,
         * bir sonraki maaşa göre yapılır.
         *
         * Eski sistem yine korunur.
         */

        if (
            typeof budget.daysUntilSalary === "number" &&
            budget.daysUntilSalary > 0
        ) {
            return budget.daysUntilSalary;
        }


        var today = new Date();

        var year = today.getFullYear();
        var month = today.getMonth();

        var lastDay = new Date(
            year,
            month + 1,
            0
        ).getDate();

        return Math.max(
            1,
            lastDay - today.getDate()
        );
    }


    function dailyAvailableMoney(amount) {

        var days = daysUntilMonthEnd();

        if (amount <= 0) {
            return 0;
        }

        return amount / days;
    }


    /* =========================
       AKILLI BÜTÇE ANALİZİ
       ========================= */

    function createBudgetAnalysis(
        available,
        afterGoal,
        monthlyGoal,
        income,
        expenses
    ) {

        var moneyForAnalysis =
            budget.goal.enabled
                ? afterGoal
                : available;

        var days =
            daysUntilMonthEnd();

        var daily =
            dailyAvailableMoney(
                Math.max(0, moneyForAnalysis)
            );


        var analysisTitle = "";
        var analysisText = "";
        var analysisClass = "";


        if (available < 0) {

            analysisTitle =
                "Bütçende açık var.";

            analysisText =
                "Bu ayki giderlerin gelirlerinden " +
                money(Math.abs(available)) +
                " daha fazla. Öncelik, zorunlu olmayan " +
                "harcamaları azaltmak ve sabit giderleri " +
                "mümkün olduğunca kontrol altında tutmak " +
                "olmalı. Yeni bir harcama yapmadan önce " +
                "bütçenin tekrar dengeye gelmesi daha mantıklı.";

            analysisClass = "danger";

        }

        else if (moneyForAnalysis === 0) {

            analysisTitle =
                "Kalan paran tamamen planlanmış.";

            analysisText =
                "Gelir ve giderlerinden sonra kullanılabilir " +
                "ekstra paran kalmıyor. Bu durumda yeni " +
                "harcamaları artırmak yerine mevcut bütçeni " +
                "korumak daha mantıklı. Bir sonraki ay için " +
                "küçük bir acil durum payı oluşturmayı " +
                "hedefleyebilirsin.";

            analysisClass = "neutral";

        }

        else if (moneyForAnalysis < income * 0.10) {

            analysisTitle =
                "Kalan paranı kontrollü kullanmalısın.";

            analysisText =
                "Gelirinin küçük bir bölümü kullanılabilir " +
                "durumda. Bu nedenle kalan paranın tamamını " +
                "günlük harcamalara ayırmak yerine bir kısmını " +
                "beklenmeyen giderler için saklamak daha mantıklı. " +
                "Özellikle ay sonuna kadar günlük harcama limitini " +
                "takip etmek bütçenin bozulmasını önleyebilir.";

            analysisClass = "warning";

        }

        else if (moneyForAnalysis < income * 0.25) {

            analysisTitle =
                "Dengeli bir bütçe alanın var.";

            analysisText =
                "Kalan paran, gelirinin makul bir bölümünü " +
                "oluşturuyor. Bunun tamamını harcamak yerine " +
                "bir bölümünü acil durum veya gelecekteki " +
                "hedeflerin için ayırmak daha sağlıklı bir " +
                "bütçe yaklaşımı olur. Geri kalan kısmı günlük " +
                "ve kişisel ihtiyaçların için kullanabilirsin.";

            analysisClass = "good";

        }

        else {

            analysisTitle =
                "Bütçende güçlü bir hareket alanı var.";

            analysisText =
                "Giderlerinden sonra gelirinin önemli bir kısmı " +
                "kullanılabilir durumda. Bu paranın tamamını " +
                "harcamak yerine önce güvenlik payı oluşturmak, " +
                "ardından gelecek hedeflerine ayırmak ve kalan " +
                "kısmı kişisel harcamalarda kullanmak daha dengeli " +
                "bir yaklaşım olur.";

            analysisClass = "excellent";

        }


        return {
            title: analysisTitle,
            text: analysisText,
            className: analysisClass,
            daily: daily,
            days: days
        };
    }


    /* =========================
       SONUÇ
       ========================= */

    function showResult(
        income,
        fixed,
        variable,
        expenses,
        available,
        monthlyGoal,
        afterGoal
    ) {

        var base = afterGoal > 0
            ? afterGoal
            : 0;


        var analysis =
            createBudgetAnalysis(
                available,
                afterGoal,
                monthlyGoal,
                income,
                expenses
            );


        var emergency =
            base * 0.30;

        var future =
            base * 0.20;

        var personal =
            base * 0.30;

        var free =
            base * 0.10;

        var unexpected =
            base * 0.10;


        var goalText =
            budget.goal.enabled
                ? money(monthlyGoal) + " / ay"
                : "Hedef belirlenmedi";


        var availableText =
            available < 0
                ? "Bütçe açığı"
                : money(available);


        document.body.innerHTML = budgetStyles() + `

        <div class="result-page">

            <div class="budget-top">

                <button
                    class="budget-back"
                    onclick="openBudget()">
                    ‹
                </button>

                <div class="budget-step">
                    BÜTÇE SONUCU
                </div>

            </div>


            <div class="result-hero">

                <div class="result-label">
                    BU AY KULLANILABİLİR PARAN
                </div>

                <div class="result-main">
                    ${availableText}
                </div>

                <div class="result-description">
                    Gelir ve giderlerini hesapladık.
                    Şimdi kalan paran için bir plan
                    oluşturabiliriz.
                </div>

            </div>


            <div class="result-grid">

                <div class="result-box">

                    <div class="result-box-title">
                        AY SONUNA KALAN
                    </div>

                    <div class="result-box-value">
                        ${analysis.days} gün
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        GÜNLÜK KULLANILABİLİR
                    </div>

                    <div class="result-box-value">
                        ${money(analysis.daily)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        TOPLAM GELİR
                    </div>

                    <div class="result-box-value">
                        ${money(income)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        TOPLAM GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(expenses)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        SABİT GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(fixed)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        DEĞİŞKEN GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(variable)}
                    </div>

                </div>


            </div>


            <div class="budget-analysis ${analysis.className}">

                <div class="analysis-label">
                    BÜTÇEPİLOT ANALİZİ
                </div>

                <div class="analysis-title">
                    ${analysis.title}
                </div>

                <div class="analysis-text">
                    ${analysis.text}
                </div>

                <div class="analysis-daily">

                    <span>
                        Ay sonuna günlük ortalama
                    </span>

                    <strong>
                        ${money(analysis.daily)}
                    </strong>

                </div>

            </div>


            ${
                budget.goal.enabled
                ? `

                <div class="goal-analysis">

                    <div class="goal-analysis-title">
                        🎯 Hedef sonrası durum
                    </div>

                    <div class="goal-analysis-text">
                        ${money(monthlyGoal)}
                        her ay hedefin için ayrılıyor.
                        Bu tutarı düzenli ayırabilirsen
                        ${money(budget.goal.amount)}
                        hedefini yaklaşık
                        ${budget.goal.months} ayda
                        tamamlamayı planlayabilirsin.
                    </div>

                </div>

                `
                : ""
            }


            ${
                available > 0
                ? `

                <div class="smart-use">

                    <div class="smart-use-title">
                        Kalan paranı nasıl kullanabilirsin?
                    </div>

                    <div class="smart-use-text">
                        Önce zorunlu olmayan harcamalarını
                        kontrol altında tut. Ardından kalan
                        paranın bir bölümünü acil durum payı
                        olarak ayırmak, bir bölümünü gelecekteki
                        hedeflerine yönlendirmek ve kalan kısmı
                        kişisel ihtiyaçların için kullanmak
                        bütçeyi daha dengeli tutmana yardımcı olur.
                    </div>

                </div>

                `
                : ""
            }


            <div class="result-grid">


                    <div class="result-box-title">
                        TOPLAM GELİR
                    </div>

                    <div class="result-box-value">
                        ${money(income)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        TOPLAM GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(expenses)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        SABİT GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(fixed)}
                    </div>

                </div>


                <div class="result-box">

                    <div class="result-box-title">
                        DEĞİŞKEN GİDER
                    </div>

                    <div class="result-box-value">
                        ${money(variable)}
                    </div>

                </div>

            </div>


            ${
                budget.goal.enabled
                ? `
                <div class="distribution">

                    <div class="distribution-title">
                        🎯 Birikim hedefin
                    </div>

                    <div class="distribution-subtitle">
                        ${money(budget.goal.amount)}
                        hedefi için
                        ${budget.goal.months} ay boyunca
                        her ay yaklaşık
                        <b style="color:#20d5c3">
                            ${money(monthlyGoal)}
                        </b>
                        ayırman gerekiyor.
                    </div>

                    <div class="result-box"
                         style="margin-top:12px">

                        <div class="result-box-title">
                            HEDEFTEN SONRA KALAN
                        </div>

                        <div class="result-box-value">
                            ${money(Math.max(0, afterGoal))}
                        </div>

                    </div>

                </div>
                `
                : ""
            }


            ${
                available > 0
                ? `

                <div class="distribution">

                    <div class="distribution-title">
                        Paran için önerilen dağılım
                    </div>

                    <div class="distribution-subtitle">
                        Bu ay kalan paranı böyle
                        planlayabilirsin.
                    </div>


                    <div class="distribution-row">

                        <div class="distribution-head">

                            <span class="distribution-name">
                                Acil durum birikimi
                            </span>

                            <span class="distribution-value">
                                ${money(emergency)}
                            </span>

                        </div>

                        <div class="distribution-bar">
                            <div
                                class="distribution-fill"
                                style="width:30%">
                            </div>
                        </div>

                    </div>


                    <div class="distribution-row">

                        <div class="distribution-head">

                            <span class="distribution-name">
                                Gelecek hedefi
                            </span>

                            <span class="distribution-value">
                                ${money(future)}
                            </span>

                        </div>

                        <div class="distribution-bar">
                            <div
                                class="distribution-fill"
                                style="width:20%">
                            </div>
                        </div>

                    </div>


                    <div class="distribution-row">

                        <div class="distribution-head">

                            <span class="distribution-name">
                                Günlük / kişisel
                            </span>

                            <span class="distribution-value">
                                ${money(personal)}
                            </span>

                        </div>

                        <div class="distribution-bar">
                            <div
                                class="distribution-fill"
                                style="width:30%">
                            </div>
                        </div>

                    </div>


                    <div class="distribution-row">

                        <div class="distribution-head">

                            <span class="distribution-name">
                                Serbest para
                            </span>

                            <span class="distribution-value">
                                ${money(free)}
                            </span>

                        </div>

                        <div class="distribution-bar">
                            <div
                                class="distribution-fill"
                                style="width:10%">
                            </div>
                        </div>

                    </div>


                    <div class="distribution-row">

                        <div class="distribution-head">

                            <span class="distribution-name">
                                Beklenmeyen gider
                            </span>

                            <span class="distribution-value">
                                ${money(unexpected)}
                            </span>

                        </div>

                        <div class="distribution-bar">
                            <div
                                class="distribution-fill"
                                style="width:10%">
                            </div>
                        </div>

                    </div>

                </div>

                `
                : available === 0
                ? `

                <div class="distribution">

                    <div class="distribution-title">
                        Bütçe dengede
                    </div>

                    <div class="distribution-subtitle">
                        Gelirlerinin tamamı giderlerine
                        ayrılmış durumda.
                    </div>

                </div>

                `
                : `

                <div class="distribution">

                    <div class="distribution-title">
                        Bütçe açığı oluştu
                    </div>

                    <div class="distribution-subtitle">
                        Giderlerin gelirlerinden daha yüksek.
                        Harcamalarını azaltarak bütçeni
                        dengeleyebilirsin.
                    </div>

                </div>

                `
            }



            <!-- =================================================
                 BÜTÇEPİLOT GELİŞMİŞ PARA YÖNETİMİ
                 V3 • V4 • V5 • V6
                 ================================================= -->

            <div class="distribution">

                <div class="distribution-title">
                    💸 Harcama Takibi
                </div>

                <div class="distribution-subtitle">
                    Yaptığın gerçek harcamaları kaydet ve
                    planladığın bütçeyle karşılaştır.
                </div>

                <div style="margin-top:16px">

                    <input
                        id="bpExpenseAmount"
                        type="number"
                        inputmode="decimal"
                        placeholder="Harcama tutarı (TL)"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-bottom:10px;
                            border-radius:12px;
                            border:1px solid rgba(32,213,195,.25);
                            background:rgba(255,255,255,.04);
                            color:inherit;
                            font-size:15px;
                        "
                    >

                    <select
                        id="bpExpenseCategory"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-bottom:10px;
                            border-radius:12px;
                            border:1px solid rgba(32,213,195,.25);
                            background:#101b1b;
                            color:inherit;
                            font-size:15px;
                        "
                    >
                        <option value="market">Market</option>
                        <option value="transport">Ulaşım</option>
                        <option value="food">Yemek</option>
                        <option value="education">Eğitim</option>
                        <option value="health">Sağlık</option>
                        <option value="entertainment">Eğlence</option>
                        <option value="subscriptions">Abonelikler</option>
                        <option value="other">Diğer</option>
                    </select>

                    <input
                        id="bpExpenseNote"
                        type="text"
                        placeholder="Açıklama (isteğe bağlı)"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-bottom:10px;
                            border-radius:12px;
                            border:1px solid rgba(32,213,195,.25);
                            background:rgba(255,255,255,.04);
                            color:inherit;
                            font-size:15px;
                        "
                    >

                    <button
                        type="button"
                        onclick="bpAddExpense()"
                        style="
                            width:100%;
                            padding:14px;
                            border:0;
                            border-radius:12px;
                            background:#20d5c3;
                            color:#071111;
                            font-weight:700;
                            font-size:15px;
                        "
                    >
                        + Harcama Ekle
                    </button>

                </div>

                <div
                    id="bpExpenseSummary"
                    style="margin-top:16px">
                </div>

            </div>


            ${
                budget.goal.enabled
                ? `

                <div class="distribution">

                    <div class="distribution-title">
                        🎯 Hedef İlerlemesi
                    </div>

                    <div class="distribution-subtitle">
                        ${money(budget.goal.amount)}
                        TL hedefinin ne kadarına ulaştığını takip et.
                    </div>

                    <div
                        id="bpGoalProgress"
                        style="margin-top:16px">
                    </div>

                    <input
                        id="bpGoalDeposit"
                        type="number"
                        inputmode="decimal"
                        placeholder="Hedefe eklenen tutar (TL)"
                        style="
                            width:100%;
                            box-sizing:border-box;
                            padding:14px;
                            margin-top:12px;
                            border-radius:12px;
                            border:1px solid rgba(32,213,195,.25);
                            background:rgba(255,255,255,.04);
                            color:inherit;
                            font-size:15px;
                        "
                    >

                    <button
                        type="button"
                        onclick="bpAddGoalSaving()"
                        style="
                            width:100%;
                            padding:14px;
                            margin-top:10px;
                            border:0;
                            border-radius:12px;
                            background:#20d5c3;
                            color:#071111;
                            font-weight:700;
                            font-size:15px;
                        "
                    >
                        + Hedefe Birikim Ekle
                    </button>

                </div>

                `
                : ""
            }


            <div class="distribution">

                <div class="distribution-title">
                    ⚠️ Bütçe Uyarıları
                </div>

                <div id="bpBudgetWarnings">
                </div>

            </div>


            <div class="distribution">

                <div class="distribution-title">
                    📅 Aylık Geçmiş
                </div>

                <div class="distribution-subtitle">
                    Daha önce oluşturduğun bütçe sonuçları.
                </div>

                <div
                    id="bpBudgetHistory"
                    style="margin-top:14px">
                </div>

            </div>

            <button
                class="new-budget-button"
                onclick="openBudget()">

                Bütçeyi Yeniden Düzenle

            </button>


            <div class="budget-note">
                Bu dağılım genel bir bütçe planlama önerisidir.
                Yatırım veya finansal ürün tavsiyesi değildir.
            </div>

        </div>
        `;

    }



    /* =========================================================
       BUTCEPILOT_V3_V4_V5_V6
       GELİŞMİŞ PARA YÖNETİMİ MOTORU
       ========================================================= */

    function bpMonthKey() {

        var now = new Date();

        return (
            now.getFullYear() +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0")
        );

    }


    function bpLoadExpenses() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "butcepilot_expenses"
                ) || "[]"
            );

        } catch (e) {

            return [];

        }

    }


    function bpSaveExpenses(data) {

        localStorage.setItem(
            "butcepilot_expenses",
            JSON.stringify(data)
        );

    }


    function bpAddExpense() {

        var amount =
            Number(
                document.getElementById(
                    "bpExpenseAmount"
                ).value
            );

        var category =
            document.getElementById(
                "bpExpenseCategory"
            ).value;

        var note =
            document.getElementById(
                "bpExpenseNote"
            ).value.trim();

        if (!amount || amount <= 0) {

            alert(
                "Lütfen geçerli bir harcama tutarı gir."
            );

            return;

        }

        var expenses =
            bpLoadExpenses();

        expenses.push({

            id: Date.now(),

            month: bpMonthKey(),

            amount: amount,

            category: category,

            note: note,

            date: new Date().toISOString()

        });

        bpSaveExpenses(expenses);

        document.getElementById(
            "bpExpenseAmount"
        ).value = "";

        document.getElementById(
            "bpExpenseNote"
        ).value = "";

        bpRenderExpenseSummary();

        bpRenderWarnings();

    }


    function bpCategoryName(category) {

        var names = {

            market: "Market",
            transport: "Ulaşım",
            food: "Yemek",
            education: "Eğitim",
            health: "Sağlık",
            entertainment: "Eğlence",
            subscriptions: "Abonelikler",
            other: "Diğer"

        };

        return names[category] || "Diğer";

    }


    function bpRenderExpenseSummary() {

        var target =
            document.getElementById(
                "bpExpenseSummary"
            );

        if (!target) return;

        var expenses =
            bpLoadExpenses().filter(
                function (item) {

                    return item.month === bpMonthKey();

                }
            );

        var total = 0;

        var categoryTotals = {};

        expenses.forEach(
            function (item) {

                total += Number(item.amount) || 0;

                if (!categoryTotals[item.category]) {
                    categoryTotals[item.category] = 0;
                }

                categoryTotals[item.category] +=
                    Number(item.amount) || 0;

            }
        );

        var html = "";

        html +=
            '<div style="font-weight:700;margin-bottom:10px">' +
            "Bu ay gerçekleşen harcama: " +
            money(total) +
            "</div>";

        if (expenses.length === 0) {

            html +=
                '<div style="opacity:.7">' +
                "Henüz harcama kaydedilmedi." +
                "</div>";

        } else {

            Object.keys(categoryTotals).forEach(
                function (category) {

                    html +=
                        '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06)">' +
                        "<span>" +
                        bpCategoryName(category) +
                        "</span>" +
                        "<strong>" +
                        money(categoryTotals[category]) +
                        "</strong>" +
                        "</div>";

                }
            );

        }

        target.innerHTML = html;

    }


    function bpGetGoalSaved() {

        return Number(
            localStorage.getItem(
                "butcepilot_goal_saved"
            ) || "0"
        );

    }


    function bpAddGoalSaving() {

        var input =
            document.getElementById(
                "bpGoalDeposit"
            );

        if (!input) return;

        var amount =
            Number(input.value);

        if (!amount || amount <= 0) {

            alert(
                "Lütfen geçerli bir birikim tutarı gir."
            );

            return;

        }

        var current =
            bpGetGoalSaved();

        var target =
            Number(budget.goal.amount) || 0;

        var newValue =
            Math.min(
                target,
                current + amount
            );

        localStorage.setItem(
            "butcepilot_goal_saved",
            String(newValue)
        );

        input.value = "";

        bpRenderGoalProgress();

    }


    function bpRenderGoalProgress() {

        var target =
            document.getElementById(
                "bpGoalProgress"
            );

        if (!target || !budget.goal.enabled) {
            return;
        }

        var goal =
            Number(budget.goal.amount) || 0;

        var saved =
            bpGetGoalSaved();

        var percentage =
            goal > 0
                ? Math.min(
                    100,
                    (saved / goal) * 100
                )
                : 0;

        var remaining =
            Math.max(
                0,
                goal - saved
            );

        target.innerHTML =

            '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +

            "<strong>" +
            money(saved) +
            "</strong>" +

            "<span>" +
            money(goal) +
            "</span>" +

            "</div>" +

            '<div style="height:10px;border-radius:20px;background:rgba(255,255,255,.08);overflow:hidden">' +

            '<div style="width:' +
            percentage +
            '%;height:100%;background:#20d5c3;border-radius:20px">' +

            "</div>" +

            "</div>" +

            '<div style="margin-top:10px;opacity:.8">' +

            Math.round(percentage) +
            "% tamamlandı • " +

            money(remaining) +
            " TL kaldı." +

            "</div>";

    }


    function bpSaveBudgetHistory(
        income,
        fixed,
        variable,
        expenses,
        available,
        monthlyGoal,
        afterGoal
    ) {

        var history = [];

        try {

            history =
                JSON.parse(
                    localStorage.getItem(
                        "butcepilot_history"
                    ) || "[]"
                );

        } catch (e) {

            history = [];

        }

        var key =
            bpMonthKey();

        var record = {

            month: key,

            income: income,

            fixed: fixed,

            variable: variable,

            expenses: expenses,

            available: available,

            monthlyGoal: monthlyGoal,

            afterGoal: afterGoal,

            daysUntilSalary:
                Number(
                    budget.daysUntilSalary
                ) || 0,

            updatedAt:
                new Date().toISOString()

        };

        var found = false;

        history =
            history.map(
                function (item) {

                    if (item.month === key) {

                        found = true;

                        return record;

                    }

                    return item;

                }
            );

        if (!found) {
            history.unshift(record);
        }

        history =
            history.slice(0, 12);

        localStorage.setItem(
            "butcepilot_history",
            JSON.stringify(history)
        );

    }


    function bpLoadHistory() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "butcepilot_history"
                ) || "[]"
            );

        } catch (e) {

            return [];

        }

    }


    function bpRenderHistory() {

        var target =
            document.getElementById(
                "bpBudgetHistory"
            );

        if (!target) return;

        var history =
            bpLoadHistory();

        if (history.length === 0) {

            target.innerHTML =
                '<div style="opacity:.7">' +
                "Henüz kayıtlı geçmiş bütçe yok." +
                "</div>";

            return;

        }

        var html = "";

        history.forEach(
            function (item) {

                html +=

                    '<div style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06)">' +

                    '<div style="display:flex;justify-content:space-between">' +

                    "<strong>" +
                    item.month +
                    "</strong>" +

                    "<strong>" +
                    money(item.available) +
                    "</strong>" +

                    "</div>" +

                    '<div style="margin-top:6px;opacity:.75;font-size:13px">' +

                    "Gelir: " +
                    money(item.income) +
                    " • Gider: " +
                    money(item.expenses) +

                    "</div>" +

                    "</div>";

            }
        );

        target.innerHTML = html;

    }


    function bpRenderWarnings() {

        var target =
            document.getElementById(
                "bpBudgetWarnings"
            );

        if (!target) return;

        var warnings = [];

        var income =
            totalIncome();

        var fixed =
            totalFixed();

        var variable =
            totalVariable();

        var available =
            income -
            fixed -
            variable;

        var actualExpenses =
            bpLoadExpenses().filter(
                function (item) {

                    return item.month === bpMonthKey();

                }
            );

        var actualTotal = 0;

        actualExpenses.forEach(
            function (item) {

                actualTotal +=
                    Number(item.amount) || 0;

            }
        );

        if (available < 0) {

            warnings.push(
                "Bütçende açık bulunuyor. Öncelikle zorunlu olmayan giderleri gözden geçir."
            );

        }

        if (
            income > 0 &&
            variable > income * 0.30
        ) {

            warnings.push(
                "Değişken giderlerin gelirinin önemli bir bölümünü oluşturuyor. Harcama planını takip etmek faydalı olabilir."
            );

        }

        if (
            budget.goal.enabled &&
            budget.goal.amount > 0 &&
            budget.daysUntilSalary > 0 &&
            (
                budget.goal.amount /
                Math.max(1, budget.goal.months)
            ) > 0 &&
            available > 0 &&
            (
                budget.goal.amount /
                Math.max(1, budget.goal.months)
            ) > available
        ) {

            warnings.push(
                "Belirlediğin hedef için gereken aylık tutar mevcut kullanılabilir paranı aşıyor."
            );

        }

        if (
            actualTotal > variable &&
            variable > 0
        ) {

            warnings.push(
                "Kaydettiğin gerçek harcamalar planladığın değişken gider toplamını aşmış görünüyor."
            );

        }

        if (
            warnings.length === 0
        ) {

            warnings.push(
                "Şu an belirgin bir bütçe uyarısı görünmüyor. Harcamalarını kaydetmeye devam ederek planını takip edebilirsin."
            );

        }

        target.innerHTML =
            warnings.map(
                function (warning) {

                    return (
                        '<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06)">' +
                        "• " +
                        warning +
                        "</div>"
                    );

                }
            ).join("");

    }


    function bpInitAdvancedFeatures() {

        bpRenderExpenseSummary();

        bpRenderGoalProgress();

        bpRenderHistory();

        bpRenderWarnings();

    }


    window.bpAddExpense =
        bpAddExpense;

    window.bpAddGoalSaving =
        bpAddGoalSaving;

    window.bpRenderExpenseSummary =
        bpRenderExpenseSummary;

    window.bpRenderGoalProgress =
        bpRenderGoalProgress;

    window.bpRenderHistory =
        bpRenderHistory;

    window.bpRenderWarnings =
        bpRenderWarnings;

    window.bpSaveBudgetHistory =
        bpSaveBudgetHistory;

    /* =========================================================
       BUTCEPILOT_V3_V4_V5_V6 SONU
       ========================================================= */

    /* =========================
       BAŞLAT
       ========================= */

    window.openBudget =
        openBudget;

    window.calculateBudget =
        calculateBudget;


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            /*
             * Ana sayfadaki butonun
             * onclick üzerinden çalışması
             * garanti altında.
             */

            var button =
                document.getElementById(
                    "startBudget"
                );

            if (button) {

                button.addEventListener(
                    "click",
                    openBudget
                );

            }

        }
    );

})();


/* === BUTCEPILOT PARA YONETIMI EKLENTISI === */

(function () {
    "use strict";

    /*
     * Bu eklenti mevcut bütçe sistemini değiştirmez.
     * Sadece sonuç ekranına para yönetimi analizi eklemek için kullanılır.
     */

    function bpMoneyManagementAnalysis(
        remainingMoney,
        daysUntilSalary,
        monthlyIncome,
        fixedExpenses,
        variableExpenses
    ) {
        var money = Number(remainingMoney) || 0;
        var days = Math.max(1, Number(daysUntilSalary) || 1);
        var income = Number(monthlyIncome) || 0;
        var fixed = Number(fixedExpenses) || 0;
        var variable = Number(variableExpenses) || 0;

        var daily = money / days;

        var fixedRate = income > 0
            ? (fixed / income) * 100
            : 0;

        var variableRate = income > 0
            ? (variable / income) * 100
            : 0;

        var title = "";
        var message = "";
        var recommendation = "";

        if (money < 0) {

            title = "Bütçende açık bulunuyor.";

            message =
                "Bir sonraki maaşına " + days +
                " gün var ancak mevcut bütçende " +
                bpMoney(Math.abs(money)) +
                " tutarında açık bulunuyor.";

            recommendation =
                "Önceliğini zorunlu giderlere vermen ve " +
                "ertelenebilir harcamaları azaltman daha kontrollü " +
                "bir bütçe oluşturmanı sağlayabilir.";

        } else if (money === 0) {

            title = "Kullanılabilir paran kalmamış.";

            message =
                "Bir sonraki maaşına " + days +
                " gün var ve bütçende kullanılabilir para kalmamış.";

            recommendation =
                "Bu dönemde yeni zorunlu olmayan harcamalar " +
                "eklememeye ve bir sonraki geliri beklemeye " +
                "odaklanman gerekiyor.";

        } else {

            if (daily < 100) {

                title = "Bütçeni oldukça dikkatli yönetmelisin.";

                message =
                    "Bir sonraki maaşına " + days +
                    " gün kaldı. Elinde " +
                    bpMoney(money) +
                    " bulunuyor. Bu da günlük ortalama " +
                    bpMoney(daily) +
                    " kullanım alanı oluşturuyor.";

                recommendation =
                    "Günlük harcamalarını mümkün olduğunca bu " +
                    "seviyenin altında tutmaya çalış. Zorunlu " +
                    "olmayan giderleri ertelemek ve küçük bir " +
                    "acil durum payı bırakmak bütçenin daha uzun " +
                    "dayanmasına yardımcı olabilir.";

            } else if (daily < 250) {

                title = "Kontrollü bir harcama planı gerekli.";

                message =
                    "Bir sonraki maaşına " + days +
                    " gün var ve " +
                    bpMoney(money) +
                    " paran bulunuyor. Günlük ortalama kullanım " +
                    "alanın " +
                    bpMoney(daily) +
                    " civarında.";

                recommendation =
                    "Paranı günlere bölerek kullanman daha mantıklı. " +
                    "Günlük limitinin tamamını kullanmak yerine " +
                    "beklenmeyen giderler için bir miktar korumaya " +
                    "çalış.";

            } else if (daily < 500) {

                title = "Bütçen dengeli görünüyor.";

                message =
                    "Bir sonraki maaşına " + days +
                    " gün var. Elindeki " +
                    bpMoney(money) +
                    " para günlük ortalama " +
                    bpMoney(daily) +
                    " kullanım alanı sağlıyor.";

                recommendation =
                    "Günlük harcamalarını takip ederek ilerle. " +
                    "Kalan paranın tamamını harcamak yerine " +
                    "bir bölümünü sonraki dönem veya beklenmeyen " +
                    "giderler için koruyabilirsin.";

            } else {

                title = "Bütçende rahat bir hareket alanı var.";

                message =
                    "Bir sonraki maaşına " + days +
                    " gün kaldı ve elinde " +
                    bpMoney(money) +
                    " bulunuyor. Günlük ortalama kullanım alanın " +
                    bpMoney(daily) +
                    " seviyesinde.";

                recommendation =
                    "Paranın tamamını günlük harcamalara ayırmak " +
                    "zorunda değilsin. Bir bölümünü birikim, gelecek " +
                    "dönem veya beklenmeyen giderler için ayırmak " +
                    "bütçeni daha kontrollü hale getirebilir.";
            }
        }

        var expenseAdvice = "";

        if (fixedRate >= 50) {

            expenseAdvice =
                "Sabit giderlerin gelirinin yaklaşık %" +
                fixedRate.toFixed(0) +
                " seviyesinde. Bu nedenle bütçenin önemli bir " +
                "kısmı düzenli giderlere gidiyor.";

        } else if (variableRate >= 30) {

            expenseAdvice =
                "Değişken giderlerin gelirinin yaklaşık %" +
                variableRate.toFixed(0) +
                " seviyesinde. Harcama takibinde özellikle " +
                "değişken giderlerini izlemen faydalı olabilir.";

        } else {

            expenseAdvice =
                "Giderlerinin dağılımı analiz edilebilir durumda. " +
                "Özellikle değişken giderlerini takip ederek " +
                "kalan paranı daha kontrollü kullanabilirsin.";
        }

        return {
            title: title,
            message: message,
            recommendation: recommendation,
            expenseAdvice: expenseAdvice,
            daily: daily,
            days: days
        };
    }


    function bpMoney(value) {
        return Number(value || 0).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " TL";
    }


    /*
     * Sonuç ekranında kullanılabilecek global fonksiyon.
     * Mevcut calculateBudget fonksiyonunu değiştirmez.
     */
    window.bpMoneyManagementAnalysis =
        bpMoneyManagementAnalysis;


    /* BUTCEPILOT_PRO_GLOBAL_BRIDGE */
    window.openProPage = openProPage;

})();




/* BUTCEPILOT_PRO_V1 */

var bpPro = {
    isPro: false
};

/*
 * Şimdilik sadece geliştirme altyapısıdır.
 * Gerçek ödeme sistemi Aşama 4'te eklenecek.
 */
function bpIsPro() {
    return bpPro.isPro === true;
}

function bpRequirePro(featureName) {

    if (bpIsPro()) {
        return true;
    }

    openProPage(featureName);
    return false;
}

function openProPage(featureName) {

    var featureText =
        featureName ||
        "Bu özellik";

    document.body.innerHTML = budgetStyles() + `
        <div style="
            min-height:100vh;
            background:#071b1f;
            color:#eef8f7;
            padding:24px 18px;
            box-sizing:border-box;
            font-family:Arial,sans-serif;
        ">

            <div style="
                max-width:760px;
                margin:0 auto;
            ">

                <button
                    onclick="location.reload()"
                    style="
                        background:none;
                        border:0;
                        color:#8fdad0;
                        font-size:15px;
                        padding:8px 0;
                        cursor:pointer;
                    "
                >
                    ← Geri
                </button>

                <div style="
                    margin-top:24px;
                    padding:26px;
                    border-radius:24px;
                    border:1px solid rgba(91,214,198,.25);
                    background:
                        linear-gradient(
                            145deg,
                            rgba(25,74,78,.95),
                            rgba(7,27,31,.98)
                        );
                    box-shadow:0 18px 50px rgba(0,0,0,.25);
                ">

                    <div style="
                        display:inline-block;
                        padding:7px 12px;
                        border-radius:999px;
                        background:rgba(91,214,198,.12);
                        color:#72d9cc;
                        font-size:12px;
                        font-weight:bold;
                        letter-spacing:1px;
                    ">
                        BÜTÇEPİLOT PRO
                    </div>

                    <h1 style="
                        margin:18px 0 10px;
                        font-size:30px;
                        line-height:1.15;
                    ">
                        Daha gelişmiş bütçe kontrolü.
                    </h1>

                    <p style="
                        color:#a9c5c3;
                        line-height:1.7;
                        margin:0;
                    ">
                        ${featureText} Pro üyelik ile kullanılabilir.
                        Şimdilik ödeme sistemi bağlı değildir.
                    </p>

                </div>

                <div style="
                    margin-top:18px;
                    display:grid;
                    gap:12px;
                ">

                    <div style="
                        padding:20px;
                        border-radius:20px;
                        background:#0d292d;
                        border:1px solid rgba(91,214,198,.16);
                    ">
                        <div style="font-size:24px;">📊</div>
                        <strong style="
                            display:block;
                            margin-top:10px;
                            font-size:17px;
                        ">
                            Gelişmiş Analiz
                        </strong>
                        <span style="
                            display:block;
                            margin-top:7px;
                            color:#9bb8b6;
                            line-height:1.5;
                        ">
                            Harcama eğilimleri ve daha ayrıntılı bütçe
                            analizleri.
                        </span>
                        <span style="
                            display:inline-block;
                            margin-top:12px;
                            color:#72d9cc;
                            font-size:12px;
                            font-weight:bold;
                        ">
                            🔒 PRO
                        </span>
                    </div>

                    <div style="
                        padding:20px;
                        border-radius:20px;
                        background:#0d292d;
                        border:1px solid rgba(91,214,198,.16);
                    ">
                        <div style="font-size:24px;">📈</div>
                        <strong style="
                            display:block;
                            margin-top:10px;
                            font-size:17px;
                        ">
                            Aylık Karşılaştırmalar
                        </strong>
                        <span style="
                            display:block;
                            margin-top:7px;
                            color:#9bb8b6;
                            line-height:1.5;
                        ">
                            Farklı ayların gelir ve giderlerini
                            karşılaştırma.
                        </span>
                        <span style="
                            display:inline-block;
                            margin-top:12px;
                            color:#72d9cc;
                            font-size:12px;
                            font-weight:bold;
                        ">
                            🔒 PRO
                        </span>
                    </div>

                    <div style="
                        padding:20px;
                        border-radius:20px;
                        background:#0d292d;
                        border:1px solid rgba(91,214,198,.16);
                    ">
                        <div style="font-size:24px;">🎯</div>
                        <strong style="
                            display:block;
                            margin-top:10px;
                            font-size:17px;
                        ">
                            Gelişmiş Hedef Takibi
                        </strong>
                        <span style="
                            display:block;
                            margin-top:7px;
                            color:#9bb8b6;
                            line-height:1.5;
                        ">
                            Daha fazla hedef ve ayrıntılı hedef
                            ilerlemesi.
                        </span>
                        <span style="
                            display:inline-block;
                            margin-top:12px;
                            color:#72d9cc;
                            font-size:12px;
                            font-weight:bold;
                        ">
                            🔒 PRO
                        </span>
                    </div>

                </div>

                <div style="
                    margin-top:18px;
                    padding:22px;
                    border-radius:20px;
                    background:#0b2428;
                    border:1px solid rgba(255,255,255,.07);
                    text-align:center;
                ">

                    <div style="
                        color:#8faead;
                        font-size:13px;
                    ">
                        Pro üyelik
                    </div>

                    <div style="
                        margin-top:8px;
                        font-size:29px;
                        font-weight:bold;
                    ">
                        29,99 TL
                        <span style="
                            font-size:14px;
                            color:#8faead;
                            font-weight:normal;
                        ">
                            / ay
                        </span>
                    </div>

                    <div style="
                        margin-top:8px;
                        color:#829d9b;
                        font-size:12px;
                    ">
                        Ödeme sistemi Aşama 4'te bağlanacak.
                    </div>

                </div>

            </div>
        </div>
    `;
}

function bpAddProLock(elementId, featureName) {

    var element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.style.position = "relative";
    element.style.cursor = "pointer";

    element.onclick = function () {
        bpRequirePro(featureName);
    };
}

window.bpIsPro = bpIsPro;
window.bpRequirePro = bpRequirePro;
window.openProPage = openProPage;
window.bpAddProLock = bpAddProLock;

/* BUTCEPILOT_PRO_V1 SONU */
