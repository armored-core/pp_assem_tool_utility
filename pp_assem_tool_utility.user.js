// ==UserScript==
// @name         ACPP Assemble Tool Utility
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       armored-core
// @match        https://k-2nd.sakura.ne.jp/ac/report/support_tool/sayhoun.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sakura.ne.jp
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const formControl = document.forms['Control'];
    const assembleTemplate = document.createElement('select');
    const robots = [
        { name: 'アペイロン', code: '[5qEEbS4H,dtmj]' },
        { name: 'パラダイスロスト', code: '[5IXQJ6Rd,ozYb]' },
        { name: '江藤機', code: '[5IgbXYr9,msB1]' },
        { name: 'PPk 502', code: '[V8zHBZkK,oA09]' },
        { name: '鬼神楽', code: '[3J0CacBJ,dt6v]' },
        { name: '9316 風重2', code: '[5Ifxm10T,93qr]' },
        { name: '9900', code: '[5IOGnDEv,ozZX]' },
        { name: '初期コアPPk X3', code: '[SiIg5n3j,oA09]' },
        { name: 'V6 PPk 1001', code: '[SimqM0oN,msCZ]' },
        { name: '1001ミサイラ', code: '[zqiyfpR,a7vx]' },
    ];
    assembleTemplate.setAttribute('id', 'assemble-template');
    assembleTemplate.innerHTML = '<option data-assem-code="">-</option>';
    robots.forEach((val) => {
        assembleTemplate.innerHTML += `<option value="${val.code}">${val.name}</option>"`;
    });
    formControl.insertBefore(
        assembleTemplate,
        document.getElementById('AssyCode')
    );

    document
        .getElementById('assemble-template')
        .addEventListener('change', function () {
            formControl.AssyCode.value = this.value;
            formControl.AssyCodeB.click();
        });
})();
