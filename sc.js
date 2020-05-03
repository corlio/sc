//
// Second Chance
//

"use strict";

$.SC = (function () {

    var Cards1     = [];
    var Cards2     = [];
    var MaxPlayers = 6;
    var Players    = 0;
    var Playing    = false;

    function setup_buttons () {
        for (var count = 1; count <= MaxPlayers; count++) {
            var button = $.dom.create('button', { 'type': 'button' });
            if (count === 1) {
                $.dom.text(button, '1 Player');
            } else {
                $.dom.text(button, $.sprintf('%d Players', count));
            }
            $.dom.on(button, 'click', start, count);
            $.dom.append('players', button);
        }
        $.dom.on('button1', 'click', handle, 1);
        $.dom.on('button2', 'click', handle, 2);
    }

    function setup_cards () {
        // setup the start cards
        Cards1.push('0000000100011100101001010');
        Cards1.push('0000011011011100010000000');
        Cards1.push('1100001100001100001100000');
        Cards1.push('0000001110010100111000000');
        Cards1.push('0000000110011110011000000');
        Cards1.push('0000001001011110100100000');
        Cards1.push('0000000101011110101000000');
        Cards1.push('0000001001011110011000000');
        Cards1.push('0000001100011110010000100');
        Cards1.push('0000000101011110010100000');
        Cards1.push('0000001001001100011001001');
        Cards1.push('0000001111010010000100001');
        Cards1.push('0000011111101010000000000');
        // setup the game cards
        Cards2.push('0000000000001000000000000');
        Cards2.push('0000000000001000000000000');
        Cards2.push('0000000000001000000000000');
        Cards2.push('0000000000001100000000000');
        Cards2.push('0000000000001100000000000');
        Cards2.push('0000000000001100000000000');
        Cards2.push('0000000000011100000000000');
        Cards2.push('0000000000011100000000000');
        Cards2.push('0000000000001000011000000');
        Cards2.push('0000000000001000011000000');
        Cards2.push('0000000000011110000000000');
        Cards2.push('0000000000011100100000000');
        Cards2.push('0000000000001100011000000');
        Cards2.push('0000000000011000011000000');
        Cards2.push('0000000000011100010000000');
        Cards2.push('0000000000011100001100000');
        Cards2.push('0000000000011100101000000');
        Cards2.push('0000000000011100110000000');
        Cards2.push('0000000000011110010000000');
        //
        Cards2.push('0000000100011100010000000');
        Cards2.push('0000001000010000111000000');
        Cards2.push('0000001110001000010000000');
        Cards2.push('0000001000011000011000000');
        Cards2.push('0000001000011100001000000');
        Cards2.push('0000000000011110011000000');
        Cards2.push('0000000000011100111000000');
        Cards2.push('0000000000111110010000000');
        Cards2.push('0000000000011110100100000');
        Cards2.push('0000000100011100110000000');
        Cards2.push('0000000100011110010000000');
        Cards2.push('0000000100011100101000000');
        Cards2.push('0000001000011000111000000');
        //
        Cards2.push('0000001010011100101000000');
        Cards2.push('0000000000010101111100000');
        Cards2.push('0000001100001100001100001');
        Cards2.push('0000000010011110001000010');
        Cards2.push('0000001110010100101000000');
        Cards2.push('0000000110011100011000000');
        Cards2.push('0000000100001000111001010');
        Cards2.push('0000001100011100011000000');
        // shuffle
        $.shuffle(Cards1);
        $.shuffle(Cards2);
    }

    function setup_slot (slot) {
        var table = $.dom.create('table', 'slot', 'centered');
        $.dom.id(table, 'slot' + slot);
        for (var row = 0; row < 5; row++) {
            var tr = $.dom.create('tr');
            for (var col = 0; col < 5; col++) {
                var td = $.dom.create('td');
                $.dom.id(td, 'c' + slot + row + col);
                $.dom.append(tr, td);
            }
            $.dom.append(table, tr);
        }
        $.dom.append('slots', table);
    }

    function setup_slots () {
        for (var slot = 1; slot <= MaxPlayers; slot++) {
            setup_slot(slot);
        }
    }

    function display (slot, card) {
        var count = (card.match(/1/g) || []).length;
        for (var row = 0; row < 5; row++) {
            for (var col = 0; col < 5; col++) {
                var td = $.dom.get('c' + slot + row + col);
                td.className = '';
                var index = 5 * row + col;
                if (card.substring(index, index + 1) === '1')
                    $.dom.class.add(td, 'color' + count);
            }
        }
    }

    function handle (_, button) {
        if (Playing) {
            if (button === 1) {
                if (Cards2.length < 2)
                    return;
                $.dom.show('slot2');
                display(1, Cards2.shift());
                display(2, Cards2.shift());
            } else {
                if (Cards2.length < 1)
                    return;
                $.dom.hide('slot2');
                display(1, Cards2.shift());
            }
            $.dom.text('button1', $.sprintf('Next (%d)', Cards2.length));
        } else {
            if (button === 1) {
                Playing = true;
                for (var slot = 3; slot <= MaxPlayers; slot++) {
                    $.dom.hide('slot' + slot);
                }
                $.dom.text('button2', 'Second Chance');
                handle(null, 1);
            } else {
                $.shuffle(Cards1);
                for (var slot = 1; slot <= Players; slot++) {
                    display(slot, Cards1[slot - 1]);
                }
            }
        }
    }

    function start (_, count) {
        console.log(count);
        Players = count;
        Playing = false;
        $.dom.hide('players');
        for (var slot = 1; slot <= MaxPlayers; slot++) {
            if (slot <= count) {
                display(slot, Cards1[slot - 1]);
                $.dom.show('slot' + slot);
            } else {
                $.dom.hide('slot' + slot);
            }
        }
        $.dom.text('button1', 'Start');
        $.dom.text('button2', 'Shuffle');
        $.dom.show('slots');
        $.dom.show('controls');
    }

    function setup () {
        $.dom.hide('players');
        $.dom.hide('slots');
        $.dom.hide('controls');
        setup_buttons();
        setup_cards();
        setup_slots();
        $.dom.show('players');
    }

    return({
        'setup':  setup,
    });
})();
