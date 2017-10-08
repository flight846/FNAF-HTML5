var hour = 0;
var hourInterval = null; // 1 game hour == 86 rl seconds = 28 game seconds
var jumpReady = false;
var leftDoor = 0;
var leftLight = 0;
var leftDisabled = 0;
var rightDoor = 0;
var rightLight = 0;
var rightDisabled = 0;
var cameraMode = 0;
var showStage = [1, 1, 1];
var activeCamImg;
var night = 1;
var timesPlayed = 0;
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

//time and power
var _oneHour = 860; //ticks per hour
var currentTime = 0;
var _perPowerUsage = 150; //ticks per powerbar
var currentUsage = 0;

//cameraState
var _currentImgPath = 'resources/img/rooms/1a_show_stage/cam_1a_';
var _currentImgRoom = '1a';


var bonnie = new moveAI('Bonnie', 'b', 'left', 'resources/img/rooms/safe_room/bonnie_jumpscare.gif', ['1a', '1b', '3', '6', '5', '2b', 'safe']);
var chick = new moveAI('Chick', 'c', 'right', 'resources/img/rooms/safe_room/chika_jumpscare.gif', ['1a', '1b', '7', '6', '4a', '4b', 'safe']);
var gameEnd = false;

var motioLeftDoor;

// reset
function reset() {
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
        if (!gameEnd) {
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
            gameEnd = true;
            //deactive door
            if (rightDoor) { rightDoor = 0; toggleDoor('right', rightDoor); }
            if (leftDoor) { leftDoor = 0; toggleDoor('left', leftDoor); }
            //power out
            setTimeout(function () {
                $('.to-hide').css('display', 'none');
                $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_power_0.png');

                $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
                $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');

                $('#powerout-sound').get(0).play();
                $('#call'+night+'').get(0).pause();
                $('#game-start').get(0).pause();
                $('#ambience2').get(0).pause();
            }, 600);

            setTimeout(function () {
                $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_powerdown_foxy.gif');
                $("#powerout-jingle").get(0).play();
            }, 12000);

            setTimeout(function () {
                $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_powerdown_end.gif');
                $("#powerout-jingle").get(0).pause();
            }, 26000);

            setTimeout(function() {
                $('.main-screen').attr('src', 'resources/img/rooms/safe_room/power_down_freddy_scare.gif');
                //play sounds
                setTimeout(function () { $("#scare").get(0).play(); }, 600);
                setTimeout(function () { $("#scare").get(0).pause(); restart(); }, 1000);
            }, (28000 + (rnd(5)*1000)));
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
            gameEnd = true;
            night++;
            $('.to-hide').css('display', 'none');
            $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
            $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
            $('.main-screen').attr('src', 'resources/img/game/5_to_6.gif');

            //sounds
            if (night < 6) {
                $('#call'+night+'').get(0).pause();
            }
            $('#win-sound').get(0).play();
            setTimeout(function () { $('#win-cheer').get(0).play(); }, 2000);
            ++timesPlayed;
            console.log(timesPlayed);
            localStorage.setItem('night', String(night));
            localStorage.removeItem('timesPlayed');
            localStorage.setItem('timesPlayed', String(timesPlayed));
            setTimeout(function() {
                location.reload();
            }, 10000);
        }
    }
}

//update power image
function updatePowerUsage() {
    powerUsage = leftDoor + rightDoor + rightLight + leftLight + cameraMode + 1;
    $('#usage-counter img').attr('src', 'resources/img/game/batt_usage_'+powerUsage+'.png');
}


//default movingAI
function moveAI(paraName, paraID, paraDoor, paraScare, paraPath) {
    var movePower = 0;
    var maxMovePower = 2000;
    var attackPower = 0;
    var maxAttackPower = 300;
    var roomPath = paraPath;
    var myName = paraName;
    var myId = paraID;
    var scareScreen = paraScare;
    var scareDoor = paraDoor;
    var currentRoom = 0;
    var insideRoom = 0;
    var insideRoomPower = 0;
    var flipCam = 0;
    var endGame = false;

    var tick = function () {
        if (!endGame && !gameEnd) {
            movePower += rnd(20);
            //check if in room
            if (insideRoom) {
                if (flipCam) { scare(); }
                else {
                    flipCam = cameraMode;
                    insideRoomPower += rnd(10);
                    if (insideRoomPower >= 1000) { scare(); }
                }
            }
            else if (roomPath[currentRoom] == 'safe') {
                attack();
            }
            else if (movePower >= maxMovePower) {
                move();
            }
        }
    }

    var move = function () {
        toMove = rnd(10);
        newRoom = rnd((roomPath.length - 2));
        //if (toMove == 1 && (currentRoom < (roomPath.length-1))) {
        if (toMove == 1) {
            //when beside safe force new room to be safe
            if (currentRoom == (roomPath.length - 2)) {
                newRoom = (roomPath.length - 1);
            }

            if ((!rooms[roomPath[newRoom]].occupy) && !(cameraMode && (_currentImgRoom == roomPath[currentRoom])) && !(cameraMode && (_currentImgRoom == roomPath[newRoom]))) {

                //clear current and move to new room
                rooms[roomPath[currentRoom]][myId] = 0;
                rooms[roomPath[currentRoom]].occupy = 0;
                //update current room
                currentRoom = newRoom;
                rooms[roomPath[currentRoom]][myId] = 1;
                rooms[roomPath[currentRoom]].occupy = 1;
                //play sound
                $('#move-sound').get(0).pause();
                $('#move-sound').get(0).currentTime = 0;
                $('#move-sound').get(0).play();
                movePower = 0;

                //if (cameraMode) { updateCamImg(_currentImgPath, _currentImgRoom); }
                console.log(myName + ' moved to', roomPath[currentRoom]);
            }
            else {
                if (cameraMode && (_currentImgRoom == roomPath[currentRoom])) { movePower = 0; console.log(myName + ' move power reset to 0'); }
                else { move(); }
            }
        }
    }

    var attack = function () {
        doorStatus = (scareDoor == 'left') ? leftDoor : rightDoor;
        if (!doorStatus) {
            console.log(myName + ' preparing to attack:', attackPower + '/' + maxAttackPower);
            attackPower += rnd(10);
            if (attackPower >= maxAttackPower) { enterOffice(); }
        }
        else {
            console.log(myName + ' attack is blocked');
            attackPower = 0;
            if (rnd(5) == 5) { move(); }
        }
    }

    var enterOffice = function () {
        //set attributes
        insideRoom = 1;
        rooms[roomPath[currentRoom]][myId] = 0;
        rooms[roomPath[currentRoom]].occupy = 0;

        if (myId == 'b') { leftDisabled = 1 }
        if (myId == 'c') { rightDisabled = 1 }
        console.log(myName + ' inside office!');
    }

    var scare = function () {
        if (!cameraMode) {
            //set displays
            $('.to-hide').css('display', 'none');
            $('.main-screen').attr('src', scareScreen);

            //play sounds
            $("#scare").get(0).play();
            setTimeout(function () {
                $("#scare").get(0).pause();
                $('.camera-cycle').get(0).play();
                $('.main-screen').attr('src', 'resources/img/game/transition-fade.gif');
            }, 2000);

            setTimeout(function () {
                $('#gameover-static').get(0).play();
                $('.main-screen').attr('src', 'resources/img/game/static.gif');
            }, 2200);

            endGame = true;
            gameEnd = true;
            console.log(myName + ' attacked!');
            setTimeout(function() { restart(); }, 8000);
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
    $('.transition img').src('resources')
    // animate in transition screen


}


function powerOut() {

}

function playerWins() {

}

function muteCall() {
    $('#call'+night+'').get(0).pause();
    $('.mute-call').css('display', 'none');
}



//all door activity
//================
var doorTimeout;
function toggleLeftDoor() {
    if (!leftDisabled) {
        leftDoor ? leftDoor = 0 : leftDoor = 1;
        toggleDoor('left', leftDoor);
    } else if (leftDisabled) {
        $('.door-light-disabled').get(0).play();
    }
}

function toggleRightDoor() {
    if (!rightDisabled) {
        rightDoor ? rightDoor = 0 : rightDoor = 1;
        toggleDoor('right', rightDoor);
    } else if (rightDisabled) {
        $('.door-light-disabled').get(0).play();
    }
}

function toggleDoor(location, door) {
    updatePowerUsage();
    $('.door-sound').get(0).pause();
    $('.door-sound').get(0).currentTime = 0;
    $('.door-sound').get(0).play();
    $('.' + location + '-switch > img').attr('src', 'resources/img/rooms/' + location + '_switch_door_' + door + '_light_' + ((location=='right') ? rightLight : leftLight) + '.png');
    $('.' + location + '-door > img').attr('src', 'resources/img/doors/' + location + '_door_' + door + '.gif');
    //doorTimeout = setTimeout(function () {
    //    $('.' + location + '-door > img').attr('src', 'resources/img/doors/' + location + '_door_' + ((door) ? 0 : 1) + '.png');
    //}, 1000);
}



//all lights activity
//================
function toggleLeftLight() {
    $('#left-light-toggle').mousedown(function () {
        if (!leftDisabled) {
            leftLight = 1;
            processLightActivty(leftLight, 'left');
        } else if (leftDisabled) {
            $('.door-light-disabled').get(0).play();
        }
    });

    $('#left-light-toggle').mouseup(function () {
        if (!leftDisabled) {
            leftLight = 0;
            processLightActivty(leftLight, 'left');
        }
    }).mouseleave(function () {
        if (!leftDisabled) {
            leftLight = 0;
            processLightActivty(leftLight, 'left');
        }
    });
}

function toggleRightLight() {
    $('#right-light-toggle').mousedown(function () {
        if (!rightDisabled) {
            rightLight = 1;
            processLightActivty(rightLight, 'right');
        } else if (rightDisabled) {
            $('.door-light-disabled').get(0).play();
        }
    })
    $('#right-light-toggle').mouseup(function () {
        if (!rightDisabled) {
            rightLight = 0;
            processLightActivty(rightLight, 'right');
        }
    }).mouseleave(function () {
        if (!rightDisabled) {
            rightLight = 0;
            processLightActivty(rightLight, 'right');
        }
    });
}

function processLightActivty(state, pos) {
    if (!gameEnd) {
        if (pos == 'left') { $('.left-switch > img').attr('src', 'resources/img/rooms/left_switch_door_' + leftDoor + '_light_' + leftLight + '.png'); }
        else { $('.right-switch > img').attr('src', 'resources/img/rooms/right_switch_door_' + rightDoor + '_light_' + rightLight + '.png'); }

        updatePowerUsage();
        state ? $(".light-on").get(0).play() : $(".light-on").get(0).pause();

        if ((pos == 'left') && state && rooms['safe'].b) { $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_bonny_right_door_scare.png'); }
        else if ((pos == 'right') && state && rooms['safe'].c) { $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_chika_left_door_scare.png'); }
        else {
            $('.main-screen').attr('src', 'resources/img/rooms/safe_room/safe_room_left_light_' + leftLight + '_right_light_' + rightLight + '.png');
        }
    }
}



//all camera activity
//================
var camTimeout;
function cameraState() {
    console.log('Camera clicked!');
    clearTimeout(camTimeout);
    cameraMode ? cameraDown() : cameraUp();
    updatePowerUsage();
    $('.camera-toggle').get(0).pause();
    $('.camera-toggle').get(0).currentTime = 0;
    $('.camera-toggle').get(0).play();
}

function cameraUp() {
    cameraMode = 1;
    $('#camera-bg2 img').attr('src', 'resources/img/cams/camera_mode_1.gif').toggleClass('display-1');
    camTimeout = setTimeout(function () {
        $('.camera-menu').removeClass('display-0, display-1').addClass('display-1');
        updateCamImg(_currentImgPath, _currentImgRoom);
        console.log('Cam up!');
        $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
    }, 500);
}

function cameraDown() {
    cameraMode = 0;
    $('.camera-menu').removeClass('display-0, display-1').addClass('display-0');
    $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-1').attr('src', 'resources/img/cams/camera_mode_0.gif');
    camTimeout = setTimeout(function () {
        $('#camera-bg2 img').removeClass('display-0, display-1').addClass('display-0');
        console.log('Cam down!');
    }, 500);
}



function transitionScreen(night) {
    if (night < 2) {
        $('.container:not(#start-screen)').addClass('animate-out');

        setTimeout(function() {
            $('.preloader').addClass('animate-out');
            $('.transition').addClass('animate-in');
        }, 14900);

        setTimeout(function() {
            $('.transition').removeClass('animate-out');
            $('.transition img').attr('src', 'resources/img/game/transition-fade.gif');
            $('.transition h2').toggleClass('display-1');
            $('.transition #night-count').html(night);
            $('.camera-cycle').get(0).play();
        }, 20000);

        setTimeout(function() {
            $('.transition').addClass('animate-out');
        }, 24000);

        setTimeout(function() {
            $('.container:not(#start-screen)').css('opacity', '1');
            $('.transition').css('display', 'none');
            gamestart();
        }, 24900);

    } else {
        $('.preloader').css('display', 'none');
        $('.transition').css('display', 'none');
        $('.container:not(#start-screen)').css('opacity', '1');
        $('.transition').css('display', 'none');
        gamestart();

    }

    activeCamImg = 'resources/img/rooms/1a_show_stage/cam_1a_b'+showStage[0]+'_c'+showStage[0]+'_f'+showStage[0]+'.png';

}

function updateCamImg(path, room, filetype) {
    _currentImgPath = (typeof path == 'undefined' ? _currentImgPath : path);
    _currentImgRoom = (typeof path == 'undefined' ? _currentImgRoom : room);
    var extension = (typeof filetype == 'undefined' ? 'png' : filetype);
    if (room == '6') {
        $('#camera-bg1 img').attr('src', _currentImgPath);
        //check sounds
        if (rooms['6'].b) { $('#kitchen-b').get(0).play(); }
        else if (rooms['6'].c) { $('#kitchen-c').get(0).play(); }
    }
    else {
        $('#camera-bg1 img').attr('src', _currentImgPath + 'b' + rooms[_currentImgRoom].b + '_c' + rooms[_currentImgRoom].c + '_f' + rooms[_currentImgRoom].f + '.' + extension);
        //check sounds
        $('#kitchen-b').get(0).pause();
        $('#kitchen-c').get(0).pause();
    }
}

function cameraToggle(ele) {
    $('#camera-id').html($(ele).data('camname'));
    $('.camera-menu ul li').removeClass('active');
    $(ele).parent().toggleClass('active');
    $('.camera-cycle').get(0).play();
}

function playRandomSound() {
    // play random sounds at random 1 night

}

function restart() {
    $("#game-start").get(0).pause();
    $("#ambience2").get(0).pause();
    // setTimeout(function() {
    //     $('.main-screen').addClass('animate-out');
    // }, 4000);
    ++timesPlayed;
    console.log(timesPlayed);
    localStorage.setItem('night', String(night));
    localStorage.removeItem('timesPlayed');
    localStorage.setItem('timesPlayed', String(timesPlayed));

    setTimeout(function() {
        $('.main-screen').attr('src', 'resources/img/game/bonnie_gameover.png');
        $('.main-screen').addClass('animate-in');
    }, 4500);
    setTimeout(function() {
        $('.main-screen').addClass('animate-out');
    }, 9500);
    setTimeout(function() {
        $(location).attr('href', 'index.html');
    }, 13500);

    return;
}

$('document').ready(function() {
    console.log('DOM is loaded...');

    reset();
    // show which night and game start
    transitionScreen(night);

    $('#cam1a').click(function () {
        updateCamImg('resources/img/rooms/1a_show_stage/cam_1a_', '1a');
        cameraToggle(this);
    }),

    $('#cam1b').click(function () {
        updateCamImg('resources/img/rooms/1b_dining_area/1b_', '1b');
        cameraToggle(this);
    }),
    $('#cam1c').click(function () {
        activeCamImg = 'resources/img/rooms/1c_pirate_cove/1c_b0_c0_f0.png';
        $('#camera-id').html($(this).data('camname'));
        $('#camera-bg1 img').attr('src', activeCamImg);
        $('.camera-menu ul li').removeClass('active');
        $(this).parent().toggleClass('active');
        $('.camera-cycle').get(0).play();
    }),
    $('#cam2a').click(function () {
        updateCamImg('resources/img/rooms/2a_west_hall/2a_', '2a', 'gif');
        cameraToggle(this);
    }),
    $('#cam2b').click(function () {
        updateCamImg('resources/img/rooms/2b_west_hall_corner/2b_', '2b');
        cameraToggle(this);
    }),
    $('#cam3').click(function () {
        updateCamImg('resources/img/rooms/3_supply_closet/3_', '3');
        cameraToggle(this);
    }),
    $('#cam4a').click(function () {
        updateCamImg('resources/img/rooms/4a_east_hall/4a_', '4a');
        cameraToggle(this);
    }),
    $('#cam4b').click(function () {
        updateCamImg('resources/img/rooms/4b_east_hall_corner/4b_', '4b');
        cameraToggle(this);
    }),
    $('#cam5').click(function () {
        updateCamImg('resources/img/rooms/5_backstage/5_', '5');
        cameraToggle(this);
    }),
    $('#cam6').click(function () {
        updateCamImg('resources/img/rooms/6_kitchen/6_b0_c0_f0.png', '6');
        cameraToggle(this);
    })
    $('#cam7').click(function () {
        updateCamImg('resources/img/rooms/7_restroom/7_', '7');
        cameraToggle(this);
    })

    //init door
    //motioLeftDoor = new Motio($('.left-door')[0], {
    //    fps: 29,
    //    frames: 14,
    //    vertical: true
    //});

});
