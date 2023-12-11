window.onload = function () { alert("注意：专题题库查不到时可以选择全部题库/大一/大二的基础题库查询。专题题库是基础题库和专题题库混合抽题的。\n\n感谢 Rosemoe 提供的 api 接口以及 inko 提供的反代服务，有任何问题可加 QQ 群 601745455 咨询。\n\n可以点击下方 Github 链接给开发者们一个 Star 或者请开发者们喝一杯咖啡么~\n\n最新题库已经更新。2023-12-11-20:17"); }

let options = document.querySelectorAll('.option div');
let optionBox = document.querySelector('.optionBox');

options.forEach(function (option) {
    option.addEventListener('click', function () {
        optionBox.value = this.innerText;
    })
})

let dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', function () {
    dropdown.classList.toggle('active');
})

let form = document.querySelector('form');
let searchBox = document.querySelector('.searchBox');
let cardContainer = document.querySelector('.cardContainer');
let title = document.querySelector('.title');
let footer = document.querySelector('footer');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (encodeURIComponent(optionBox.value) == "%E5%85%A8%E9%83%A8%E9%A2%98%E5%BA%93")
        var apiUrl = 'https://api-rosemoe-cyou.inko.lv/v1/problem_bank/query?problem_set=all&content_query=' + encodeURIComponent(searchBox.value);
    else
        var apiUrl = 'https://api-rosemoe-cyou.inko.lv/v1/problem_bank/query?problem_set=' + encodeURIComponent(optionBox.value) + '&content_query=' + encodeURIComponent(searchBox.value);
    let xhr = new XMLHttpRequest();

    xhr.open('GET', apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.success === true) {
                    cardContainer.innerHTML = '';
                    cardContainer.style.display = 'none';
                    if (window.innerWidth < 900) {
                        form.style.top = '150px';
                        title.style.top = '100px';
                        footer.style.display = "block";
                    }
                    else {
                        form.style.top = '350px';
                        title.style.top = '300px';
                    }

                    if (response.results.length > 0) {
                        if (window.innerWidth < 900) {
                            form.style.top = '50px';
                            title.style.top = '30px';
                            footer.style.display = "none";
                        }
                        else {
                            form.style.top = '110px';
                            title.style.top = '80px';
                        }
                        cardContainer.style.display = 'block';

                        response.results.forEach(function (result) {
                            let card = document.createElement('div');
                            card.classList.add('card');

                            let content = document.createElement('div');
                            content.classList.add('content');
                            content.textContent = result.content;

                            let optionsList = document.createElement('div');
                            optionsList.classList.add('optionsList');

                            result.options.forEach(function (option) {
                                let optionItem = document.createElement('div');
                                optionItem.textContent = option.name + '. ' + option.content;

                                optionsList.appendChild(optionItem);
                            })

                            let answer = document.createElement('div');
                            answer.classList.add('answer');
                            answer.textContent = '答案：' + result.answer;

                            let line = document.createElement('div');
                            line.classList.add('line');

                            card.appendChild(content);
                            card.appendChild(line.cloneNode(true));
                            card.appendChild(optionsList);
                            card.appendChild(line.cloneNode(true));
                            card.appendChild(answer);
                            cardContainer.appendChild(card);
                        })
                    }
                    else alert('没有找到相关的题目！');
                }
                else if (response.message === 'forbidden: keyword should be at least 2 characters') alert('题目或关键词至少为2个字符！');
                else if (response.message === 'forbidden: keyword can not contain brackets') alert('题目或关键词不能包含括号！');
            }
            else alert('API请求失败！请访问 https://ath.inko.lv 或加 QQ 群 601745455 咨询。');
        }
    }

    xhr.send();
})