// ==UserScript==
// @name         ACPP Assemble Tool Utility
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       armored-core
// @match        *://k-2nd.sakura.ne.jp/ac/report/support_tool/sayhoun.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sakura.ne.jp
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const formControl = document.forms["Control"];
  const assembleTemplate = document.createElement("select");
  const robots = [
    { name: "アペイロン", code: "[5qEEbS4H,dtmj]" },
    { name: "パラダイスロスト", code: "[5IXQJ6Rd,ozYb]" },
    { name: "江藤機", code: "[5IgbXYr9,msB1]" },
    { name: "PPk 502", code: "[V8zHBZkK,oA09]" },
    { name: "鬼神楽", code: "[3J0CacBJ,dt6v]" },
    { name: "9316 風重2", code: "[5Ifxm10T,93qr]" },
    { name: "9900", code: "[5IOGnDEv,ozZX]" },
    { name: "初期コアPPk X3", code: "[SiIg5n3j,oA09]" },
    { name: "V6 PPk 1001", code: "[SimqM0oN,msCZ]" },
    { name: "1001ミサイラ", code: "[zqiyfpR,a7vx]" },
  ];
  assembleTemplate.setAttribute("id", "assemble-template");
  assembleTemplate.innerHTML = '<option data-assem-code="">-</option>';
  robots.forEach((val) => {
    assembleTemplate.innerHTML += `<option value="${val.code}">${val.name}</option>"`;
  });
  formControl.insertBefore(
    assembleTemplate,
    document.getElementById("AssyCode"),
  );

  document
    .getElementById("assemble-template")
    .addEventListener("change", function () {
      formControl.AssyCode.value = this.value;
      formControl.AssyCodeB.click();
    });

  // 初代ACモードチェックボックス
  const ac1ModeCheckbox = document.createElement("input");
  ac1ModeCheckbox.type = "checkbox";
  ac1ModeCheckbox.id = "Ac1Mode";
  const ac1ModeLabel = document.createElement("label");
  ac1ModeLabel.htmlFor = "Ac1Mode";
  ac1ModeLabel.textContent = "初代ACモード";
  const openPtList = document.getElementById("OpenPtList");
  openPtList.parentNode.insertBefore(ac1ModeLabel, openPtList);
  openPtList.parentNode.insertBefore(ac1ModeCheckbox, ac1ModeLabel);

  // PP追加パーツのカテゴリ別インデックス
  // index 8(右肩)はusualDeadParts内でarrTmp[8]=arrTmp[7]として共通化されるため7のみ指定
  const ppParts = [
    [0, [10]], // head: HD-G780
    [1, [3]], // core: XXA-S0
    [2, [17]], // arm: AW-DC/2
    [3, [11]], // leg: LN-2KZ-SP
    [4, [7, 8]], // gene: GBX-TL, GBX-XL
    [5, [8, 9]], // fcs: FBMB-18X, RATOR
    [6, [6]], // booster: B-HP25
    [7, [12, 13, 14, 15, 33, 41]], // bw: WM-AT, WM-TO100, WM-SMSS24, M118-TD, WC-IR24, RZ-Fw2
    [10, [15, 16, 17, 18, 19]], // raw: WG-RFM118, WG-XFwPPk, WG-HG1, WG-PB26, WA-Finger
    [11, [11]], // option: SP-DEhf
  ];

  let ac1ModeActive = false;

  // 既存の仕様制限関数をラップしてPP制限を注入
  const _usualDeadParts = window.usualDeadParts;
  window.usualDeadParts = function () {
    const arrTmp = _usualDeadParts();
    if (ac1ModeActive) {
      ppParts.forEach(([categ, indices]) => arrTmp[categ].push(...indices));
    }
    return arrTmp;
  };

  // 4足/戦車の初代AC待機E表示
  const restWaitDrainInput = document.getElementById("RestWaitDrain");

  // "待機"テキストノードをspanに置換してラベル切替可能にする
  const waitTextNode = restWaitDrainInput.previousSibling;
  const waitLabelText = waitTextNode.textContent;
  const waitLabelIdx = waitLabelText.lastIndexOf("待機");
  const waitLabelSpan = document.createElement("span");
  waitLabelSpan.id = "ac1-wait-label";
  waitLabelSpan.textContent = "待機";
  const beforeWaitText = document.createTextNode(
    waitLabelText.substring(0, waitLabelIdx),
  );
  waitTextNode.parentNode.replaceChild(waitLabelSpan, waitTextNode);
  waitLabelSpan.parentNode.insertBefore(beforeWaitText, waitLabelSpan);

  // AC1待機E表示用コンテナ(waitLabelSpanの前に挿入)
  const ac1WaitContainer = document.createElement("span");
  ac1WaitContainer.id = "ac1-wait-container";
  ac1WaitContainer.style.display = "none";
  ac1WaitContainer.appendChild(document.createTextNode("待機"));
  const ac1WaitInput = document.createElement("input");
  ac1WaitInput.type = "text";
  ac1WaitInput.className = "TxtBoxM";
  ac1WaitInput.id = "Ac1RestWaitDrain";
  ac1WaitContainer.appendChild(ac1WaitInput);
  ac1WaitContainer.appendChild(document.createTextNode("　"));
  waitLabelSpan.parentNode.insertBefore(ac1WaitContainer, waitLabelSpan);

  // 稼動Eの要素を取得し、spanでラップして表示切替可能にする
  const restActDrainInput = document.getElementById("RestActDrain");
  const actDrainContainer = document.createElement("span");
  actDrainContainer.id = "ac1-act-drain-container";
  restActDrainInput.parentNode.insertBefore(actDrainContainer, restActDrainInput.previousSibling);
  actDrainContainer.appendChild(restActDrainInput.previousSibling);
  actDrainContainer.appendChild(restActDrainInput);

  // writeDViewをラップしてAC1待機E表示を更新
  const _writeDView = window.writeDView;
  window.writeDView = function () {
    _writeDView();
    const isQuadOrTank =
      window.leg[window.LEG].clss === "QS" ||
      window.leg[window.LEG].clss === "TQ";
    if (ac1ModeActive && isQuadOrTank) {
      ac1WaitContainer.style.display = "";
      actDrainContainer.style.display = "none";
      waitLabelSpan.textContent = "空中/旋回";
      const drain =
        window.leg[window.LEG].ed +
        window.head[window.HEAD].ed +
        window.core[window.CORE].ed +
        window.arm[window.ARM].ed +
        window.fcs[window.FCS].ed;
      const surplus = window.geneOutput - drain;
      ac1WaitInput.value = surplus;
      ac1WaitInput.style.color = surplus >= window.waitDrainCap ? "aqua" : "";
    } else {
      ac1WaitContainer.style.display = "none";
      actDrainContainer.style.display = "";
      waitLabelSpan.textContent = "待機";
    }
  };

  function toggleAc1Mode() {
    ac1ModeActive = ac1ModeCheckbox.checked;
    window.routineManager(false, true, true, true);
  }

  ac1ModeCheckbox.addEventListener("change", toggleAc1Mode);
})();
