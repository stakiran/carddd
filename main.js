'use strict';

class CardDisplay {
    constructor(selectorNameExpressedUL) {
        this._selectorName = selectorNameExpressedUL;
        this._cardNames = [];
    }

    clear() {
        $(`${this._selectorName} > .card`).remove();
        this._cardNames = [];
    }

    add(cardName) {
        $(`${this._selectorName}`).append(`<div class="card" draggable="true" ondragstart="onDragStartListElement(event)" >${cardName}</div>`)
        this._cardNames.push(cardName);
    }
}

const LINEBREAK = '\n';
let offsetPositionInCard = [0, 0];

function onDragStartListElement(event){
    console.log('dragstart');

    const dummy = 'dummy';
    event.dataTransfer.setData('text/plain', dummy);
}

function onDragOverForDetectingDrop(event){
    console.log('dragover');

    // dragover イベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
    // See: http://www.htmq.com/dnd/
    event.preventDefault();
}

function onDroppedBody(event){
    console.log('dropped');

    const targetSelector = '.selected-card';
    const clientX = event.clientX;
    const clientY = event.clientY;

    const offsetX = offsetPositionInCard[0];
    const offsetY = offsetPositionInCard[1];

    const moveX = clientX - offsetX;
    const moveY = clientY - offsetY;


    $(targetSelector).offset({
        top: moveY,
        left: moveX,
    });

	event.preventDefault();
}

$(function() {
    let cardDisplay = new CardDisplay('#cardContainer');

    $('#cardEditor').val(''); // reload 時でも確実にクリアしたい

    $('#cardEditor').change(function(){
        let listByStr = $(this).val();
        let listByArray = listByStr.split(LINEBREAK);

        cardDisplay.clear();
        for(const cardName of listByArray) {
            if(cardName.trim() == ''){
                continue;
            }
            cardDisplay.add(cardName);
        }
    });

    $('#cardContainer').on('mouseenter', '.card', function(){
        // キーボードによる選択が残っていることがあるので確実に消す.
        $('.card').removeClass('selected-card');

        let card = $(this);
        const idx = $('#cardContainer > .card').index(this);
        let cardName = card.text();

        card.addClass('selected-card');
    }).on('mouseleave', '.card', function(){
        let card = $(this);
        card.removeClass('selected-card');
    });

    // See: https://stackoverflow.com/questions/3234977/using-jquery-how-to-get-click-coordinates-on-the-target-element
    $('#cardContainer').on('mousedown', '.card', function(e){
        let elm = $(this);
        let xPos = e.pageX - elm.offset().left;
        let yPos = e.pageY - elm.offset().top;
        offsetPositionInCard = [xPos, yPos];
    });
});
