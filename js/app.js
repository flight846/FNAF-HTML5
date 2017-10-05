var time = 172; // Game seconds
var hour = 0;
var hourInterval = null; // 1 game hour == 86 rl seconds = 28 game seconds
var powerInterval;
var jumpReady = false;
var leftDoor = 0;
var leftLight = 0;
var rightDoor = 0;
var rightLight = 0;
var cameraMode = 0;
var showStage = [1, 1, 1];
var activeCamImg;
var night = 1;
var power = 100;
//var powerUsage = (leftDoor + rightDoor + rightLight + leftLight + cameraMode + 1);
//var decrementPower = 15000 / powerUsage;
var time = 1;
var cam1aClicks = 0;
var order;
var rooms = {
    '1a': { f: 1, c: 1, b: 1 },
    '1b': { f: 0, c: 0, b: 0, occupy: 0 },
    '2a': { f: 0, c: 0, b: 0, occupy: 0 },
    '2b': { f: 0, c: 0, b: 0, occupy: 0 },
    '4a': { f: 0, c: 0, b: 0, occupy: 0 },
    '4b': { f: 0, c: 0, b: 0, occupy: 0 },
    '3': { f: 0, c: 0, b: 0, occupy: 0 },
    '5': { f: 0, c: 0, b: 0, occupy: 0 },
    '6': { f: 0, c: 0, b: 0, occupy: 0 },
    '7': { f: 0, c: 0, b: 0, occupy: 0 },
    'safe': { f: 0, c: 0, b: 0 }
};
var foxyStatus = 0;
var levelCode = Math.floor((Math.random() * 10) + 1); // random 1 to 10 ** how fast the anematronics move in seconds


var _oneHour = 860; //ticks per hour
var currentTime = 0;
var _perPowerUsage = 150; //ticks per powerbar
var currentUsage = 0;

//cameraState
var _currentImgPath = '/resources/img/rooms/1a_show_stage/cam_1a_';
var _currentImgRoom = '1a';


var bonnie = new bonnieAI();
var chick = new chickAI();
var gameover = false;

// reset
function reset() {
    time = 172;
    jumpReady = false;
    powerOutAttacked = false;
    alreadyAttacked = false;
    rightDoor = 0;
    leftDoor = 0;
    power = 100;
    cam1aClicks = 0;
    // location.replace('/index.html');
}

function gamestart() {
    initGameTime();
    toggleLeftLight();
    toggleRightLight();
    updatePowerUsage();
    $("#game-start").get(0).play();
    $("#game-start")[0].volume = 0.3;
    $("#ambience2").get(0).play();
}


//constants running game ticks
function initGameTime() {
    setInterval(function () {
        if (!gameover) {
            burnTime();
            burnPower();
        }
        bonnie.tick();
        chick.tick();
    }, 100);
}

//logic to burn power
function burnPower() {
    var powerUsage = (leftDoor*2) + (rightDoor*2) + rightLight + leftLight + cameraMode + 1;
    currentUsage += powerUsage;
    if (currentUsage >= _perPowerUsage) {
        power -= 1;
        $('#power-counter').html(power);
        currentUsage = 0;

        if (power == 0) {
            console.log('GAME LOSE ->> Out of power');
            gameover = true;
            $('.to-hide').css('display', 'none');
            $(".door-on").get(0).play();
            $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_power_0.png');

            $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
            $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
            setTimeout(function () {
                $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_powerdown_foxy.gif');
            }, 2000);
            restart();
        }
    }
}

//constant running night
function burnTime() {
    currentTime += 1;
    if (currentTime >= _oneHour) {
        hour++;
        $('#hour-counter').html(hour);
        currentTime = 0;

        if (hour == 6) {
            console.log('GAME WIN ->> Proceed next night');
            gameover = true;
            $('.to-hide').css('display', 'none');
            $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
            $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
            $('.background .main-screen').attr('src', 'resources/img/game/5_to_6.gif');
        }
    }
}

//update power image
function updatePowerUsage() {
    powerUsage = leftDoor + rightDoor + rightLight + leftLight + cameraMode + 1;
    $('#usage-counter img').attr('src', 'resources/img/game/batt_usage_'+powerUsage+'.png');
}





function bonnieAI() {
    var movePower = 0;
    var attackPower = 0;
    var roomPath = ['1a', '1b', '3', '5', '2b', 'safe'];
    var currentRoom = 0;
    var endGame = false;

    var tick = function () {
        if (!endGame && !gameover) {
            movePower += rnd(10);
            //check if ai at room
            if (roomPath[currentRoom] == 'safe') {
                attack();
            }
            else if (movePower >= 500) {
                move();
            }
        }
    }

    var move = function () {
        toMove = rnd(10);
        newRoom = rnd((roomPath.length - 1));
        //if (toMove == 1 && (currentRoom < (roomPath.length-1))) {
        if (toMove == 1) {
            if ((!rooms[roomPath[newRoom]].occupy) && !(cameraMode && (_currentImgRoom == roomPath[currentRoom]))) {
                //clear current and move to new room
                rooms[roomPath[currentRoom]].b = 0;
                rooms[roomPath[currentRoom]].occupy = 0;

                currentRoom = rnd((roomPath.length - 1));

                rooms[roomPath[currentRoom]].b = 1;
                rooms[roomPath[currentRoom]].occupy = 1;

                movePower = 0;
                if (cameraMode) { updateCamImg(_currentImgPath, _currentImgRoom); }
                console.log('Bonnie moved to', roomPath[currentRoom]);
            }
            else { move(); }
        }
        //console.log('', toMove);
    }

    var attack = function () {
        console.log('Bonnie preparing to attack: ', attackPower);
        if (!leftDoor) {
            attackPower += rnd(10);
            if (attackPower >= 300) { scare(); }
        }
        else {
            attackPower = 0;
            if (rnd(5) == 5) { move(); }
            console.log('Bonnie attack failed');
        }
    }

    var scare = function () {
        if (!cameraMode) {
            $('.to-hide').css('display', 'none');
            $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/bonnie_jumpscare.gif');
            endGame = true;
            gameover = true;
            console.log('Bonnie attacked!');
            restart();
        }
    }

    return { tick: tick };
}


function chickAI() {
    var movePower = 0;
    var attackPower = 0;
    var roomPath = ['1a', '1b', '4a', '4b', '7', 'safe'];
    var currentRoom = 0;
    var endGame = false;

    var tick = function () {
        if (!endGame && !gameover) {
            movePower += rnd(10);
            //check if ai at room
            if (roomPath[currentRoom] == 'safe') {
                attack();
            }
            else if (movePower >= 500) {
                move();
            }
        }
    }

    var move = function () {
        toMove = rnd(10);
        newRoom = rnd((roomPath.length - 1));

        if (toMove == 1) {
            if ((!rooms[roomPath[newRoom]].occupy) && !(cameraMode && (_currentImgRoom==roomPath[currentRoom]))){
                //clear current and move to new room
                rooms[roomPath[currentRoom]].c = 0;
                rooms[roomPath[currentRoom]].occupy = 0;

                currentRoom = rnd((roomPath.length - 1));

                rooms[roomPath[currentRoom]].c = 1;
                rooms[roomPath[currentRoom]].occupy = 1;

                movePower = 0;
                if (cameraMode) { updateCamImg(_currentImgPath, _currentImgRoom); }
                console.log('Chick moved to', roomPath[currentRoom]);
            }
            else { move(); }
        }
    }

    var attack = function () {
        console.log('Chick preparing to attack: ', attackPower);
        if (!rightDoor) {
            attackPower += rnd(10);
            if (attackPower >= 300) { scare(); }
        }
        else {
            attackPower = 0;
            if (rnd(5) == 5) { move(); }
            console.log('Chick attack failed');
        }
    }

    var scare = function () {
        if (!cameraMode) {
            $('.to-hide').css('display', 'none');
            $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/chika_jumpscare.gif');
            endGame = true;
            gameover = true;
            console.log('Chick attacked!');
            restart();
        }
    }

    return { tick: tick };
}



//create a random number
function rnd(length) {
    return Math.floor((Math.random() * length) + 1);
}


function addNight() {
    $('.container:not(#start-screen)').addClass('animate-out');
    // change transition image
    $('.transition img').src('/resources')
    // animate in transition screen


}


function powerOut() {

}

function playerWins() {

}

function muteCall() {
    $("#call").get(0).pause();
    $('.mute-call').css('display', 'none');
}

function toggleLeftDoor() {
    leftDoor?leftDoor = 0:leftDoor = 1;
    updatePowerUsage();
    $(".door-on").get(0).play();
    $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_'+leftDoor+'_light_'+leftLight+'.png');
    $('.left-door > img').attr('src', 'resources/img/doors/left_door_'+leftDoor+'.gif');
}

function toggleRightDoor() {
    rightDoor ? rightDoor = 0 : rightDoor = 1;
    updatePowerUsage();
    $(".door-on").get(0).play();
    $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_'+rightDoor+'_light_'+rightLight+'.png');
    $('.right-door > img').attr('src', 'resources/img/doors/right_door_'+rightDoor+'.gif');
}


//all lights activity
function toggleLeftLight() {
    $('#left-light-toggle').mousedown(function () {
        leftLight = 1;
        processLightActivty(leftLight, 'left');
    });

    $('#left-light-toggle').mouseup(function() {
        leftLight = 0;
        processLightActivty(leftLight, 'left');
    }).mouseleave(function () {
        leftLight = 0;
        processLightActivty(leftLight, 'left');
    });
}

function toggleRightLight() {
    $('#right-light-toggle').mousedown(function() {
        rightLight = 1;
        processLightActivty(rightLight, 'right');
    })
    $('#right-light-toggle').mouseup(function() {
        rightLight = 0;
        processLightActivty(rightLight, 'right');
    }).mouseleave(function () {
        rightLight = 0;
        processLightActivty(rightLight, 'right');
    });
}

function processLightActivty(state, pos) {
    if (pos == 'left') { $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_' + leftDoor + '_light_' + leftLight + '.png'); }
    else { $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_' + rightDoor + '_light_' + rightLight + '.png'); }

    updatePowerUsage();
    state ? $(".light-on").get(0).play() : $(".light-on").get(0).pause();

    if ((pos == 'left') && state && rooms['safe'].b) { $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_bonny_right_door_scare.png'); }
    else if ((pos == 'right') && state && rooms['safe'].c) { $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_chika_left_door_scare.png'); }
    else {
        $('.background .main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_' + leftLight + '_right_light_' + rightLight + '.png');
    }
}



function cameraState() {
    console.log('Camera clicked!');
    cameraMode ? cameraDown() : cameraUp();
}

function cameraUp() {
    cameraMode = 1;
    updatePowerUsage();
    $('.camera-toggle').get(0).play();
    $('#camera-bg2 img').attr('src', 'resources/img/cams/camera_mode_1.gif').toggleClass('display-1');
    setTimeout(function() {
        $('.camera-menu').removeClass('display-0, display-1').addClass('display-1');
        updateCamImg(_currentImgPath, _currentImgRoom);
        console.log('End cameraState function..');
        $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
    }, 500);
}

function cameraDown() {
    cameraMode = 0;
    updatePowerUsage();
    $('.camera-toggle').get(0).play();
    $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
    $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-1').attr('src', 'resources/img/cams/camera_mode_0.gif');
    setTimeout(function() {
        $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
        console.log('End cameraState function..');
    }, 500);
}

function bonnieScare() {

}

function bonnieAttackIfClosed() {


}

function disableBonnie() {

}

// function disableButtons() {
//     $('.left-door-switch').hide();
//     $('.right-door-switch').hide();
//     $('.control').hide();
//     $('.toggle-camera').hide();
// }

function removeDoors() {

}

function powerOutAttacked() {
    if (power === 0) {
        return true
    } else {
        return false
    }
}

function powerOutFreddy() {
    if(powerOutAttacked() === true) {
        disableButtons();
        $('#main-screen').css('background-image', 'url()');
        menu();
    }
}

function transitionScreen(night) {
    $('.container:not(#start-screen)').addClass('animate-out');

    setTimeout(function() {
        $('.transition').addClass('animate-out');
    }, 2900);

    setTimeout(function() {
        $('.transition').removeClass('animate-out');
        $('.transition img').attr('src', '/resources/img/game/transition-fade.gif');
        $('.transition h2').toggleClass('display-1');
        $('.transition #night-count').html(night);
        $('.camera-cycle').get(0).play();
    }, 4000);

    setTimeout(function() {
        $('.transition').addClass('animate-out');
    }, 6000);

    setTimeout(function() {
        $('.container:not(#start-screen)').css('opacity', '1');
        $('.transition').css('display', 'none');
        gamestart();
    }, 6900);

    activeCamImg = '/resources/img/rooms/1a_show_stage/cam_1a_b'+showStage[0]+'_c'+showStage[0]+'_f'+showStage[0]+'.png';

}

function continueGame() {
    if (night > 2) {
        // show continue game?

    }
}


function updateCamImg(path, room) {
    _currentImgPath = path;
    _currentImgRoom = room;
    $('#camera-bg1 img').attr('src', _currentImgPath + 'b' + rooms[_currentImgRoom].b + '_c' + rooms[_currentImgRoom].c + '_f' + rooms[_currentImgRoom].f + '.png');
}

function restart() {
    $("#scare").get(0).play();
    setTimeout(function() {
        $("#scare").get(0).pause();
    }, 4000);
    $("#game-start").get(0).pause();
    $("#ambience2").get(0).pause();
    // setTimeout(function() {
    //     $('.background .main-screen').addClass('animate-out');
    // }, 4000);
    setTimeout(function() {
        $('.background .main-screen').attr('src', 'resources/img/game/bonnie_gameover.png');
        $('.background .main-screen').addClass('animate-in');
    }, 4500);
    setTimeout(function() {
        $('.background .main-screen').addClass('animate-out');
    }, 19500);
    setTimeout(function() {
        $(location).attr('href', '/');
    }, 20500);
}

$('document').ready(function() {
    console.log('DOM is loaded...');
    if (location.pathname === '/main.html') {
        reset();
        // show which night and game start
        transitionScreen(night);

        $('#cam1a').click(function() {
            //cam1aClicks++;
            //if (cam1aClicks >= 3 && cam1aClicks < 5 && showStage[0] == 1 && showStage[1] == 1 && showStage[2] == 1) {
            //    console.log('Cam1a clicks: ', cam1aClicks);
            //    activeCamImg = '/resources/img/rooms/1a_show_stage/cam_1a_turn.png';
            //    $('#camera-id').html($(this).data('camname'));
            //    $('#camera-bg1 img').attr('src', activeCamImg);
            //    $('.camera-menu ul li').removeClass('active');
            //    $(this).parent().toggleClass('active');
            //    $('.camera-cycle').get(0).play();
            //} else {
            //activeCamImg = '/resources/img/rooms/1a_show_stage/cam_1a_b' + rooms['1a'].b + '_c' + rooms['1a'].c + '_f' + rooms['1a'].f + '.png';
            updateCamImg('/resources/img/rooms/1a_show_stage/cam_1a_','1a');
                $('#camera-id').html($(this).data('camname'));
                //$('#camera-bg1 img').attr('src', activeCamImg);
                $('.camera-menu ul li').removeClass('active');
                $(this).parent().toggleClass('active');
                $('.camera-cycle').get(0).play();
            //}
        }),

        $('#cam1b').click(function() {
            //activeCamImg = '/resources/img/rooms/1b_dining_area/1b_b' + rooms['1b'].b + '_c' + rooms['1b'].c + '_f' + rooms['1b'].f + '.png';
            updateCamImg('/resources/img/rooms/1b_dining_area/1b_','1b');
            $('#camera-id').html($(this).data('camname'));
            //$('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam1c').click(function() {
            activeCamImg = '/resources/img/rooms/1c_pirate_cove/1c_b0_c0_f0.png';
            $('#camera-id').html($(this).data('camname'));
            $('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam2a').click(function() {
            activeCamImg = '/resources/img/rooms/2a_west_hall/2a_b0_c0_f0.gif';
            $('#camera-id').html($(this).data('camname'));
            $('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam2b').click(function() {
            //activeCamImg = '/resources/img/rooms/2b_west_hall_corner/2b_b' + rooms['1b'].b + '_c' + rooms['1b'].c + '_f' + rooms['1b'].f + '.png';
            updateCamImg('/resources/img/rooms/2b_west_hall_corner/2b_','2b');
            $('#camera-id').html($(this).data('camname'));
            //$('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam3').click(function() {
            //activeCamImg = '/resources/img/rooms/3_supply_closet/3_b' + rooms['1b'].b + '_c' + rooms['1b'].c + '_f' + rooms['1b'].f + '.png';
            updateCamImg('/resources/img/rooms/3_supply_closet/3_','3');
            $('#camera-id').html($(this).data('camname'));
            //$('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam4a').click(function() {
            //activeCamImg = '/resources/img/rooms/4a_east_hall/4a_b0_c0_f0.png';
            updateCamImg('/resources/img/rooms/4a_east_hall/4a_', '4a');
            $('#camera-id').html($(this).data('camname'));
            //$('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam4b').click(function() {
            //activeCamImg = '/resources/img/rooms/4b_east_hall_corner/4b_b0_c0_f0.png';
            updateCamImg('/resources/img/rooms/4b_east_hall_corner/4b_', '4b');

            $('#camera-id').html($(this).data('camname'));
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam5').click(function() {
            //activeCamImg = '/resources/img/rooms/5_backstage/5_b' + rooms['1b'].b + '_c' + rooms['1b'].c + '_f' + rooms['1b'].f + '.png';
            updateCamImg('/resources/img/rooms/5_backstage/5_','5');
            $('#camera-id').html($(this).data('camname'));
            //$('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        }),
        $('#cam6').click(function() {
            activeCamImg = '/resources/img/rooms/6_kitchen/6_b0_c0_f0.png';
            $('#camera-id').html($(this).data('camname'));
            $('#camera-bg1 img').attr('src', activeCamImg);
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        })
        $('#cam7').click(function() {
            //activeCamImg = '/resources/img/rooms/7_restroom/7_b0_c0_f0.png';
            updateCamImg('/resources/img/rooms/7_restroom/7_', '7');

            $('#camera-id').html($(this).data('camname'));
            $('.camera-menu ul li').removeClass('active');
            $(this).parent().toggleClass('active');
            $('.camera-cycle').get(0).play();
        })


    }
});
