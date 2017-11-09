var url = null,
    kankalar = [];

var log = function (str) {
        console.log(str);
    },
    urlUpdate = function () {
        chrome.tabs.query({'active': true}, function (tabs) {
            url = tabs[0].url;
        });
    },
    dataGet = function () {
        chrome.storage.sync.get("kankaData", function (items) {
            for (var i in items.kankaData) {
                kankalar.push(items.kankaData[i]);
            }
            dataCheck();
            dataUpdate();
        });

    },
    dataSet = function () {
        chrome.storage.sync.set({"kankaData": kankalar});
    },
    dataCheck = function () {
        if (jQuery.isEmptyObject(kankalar)) {
            $('.ifEmpty').show();
            $('.sendtoall').hide();
        } else {
            $('.ifEmpty').hide();
            $('.sendtoall').show();
        }
    },
    dataUpdate = function () {
        var str = '';
        $('.list.friends ul').html("");
        if (!jQuery.isEmptyObject(kankalar)) {
            for (var k in kankalar) {
                
                    str = '<li data-id="' + kankalar[k].id + '"><a href="#" title="' + kankalar[k].eposta + '" class="ico arrow">';
                    str += kankalar[k].isim;
                    str += '</a><a href="#" class="ico remove">Çıkart</a></li>';
                    $('.list.friends ul').append(str);
                
            }
            $('.list.friends li .remove').click(function () {
                var dataid = $(this).parents('li:first').attr('data-id');
                var newData = [];
                for (var k in kankalar) {
                    
                        if (kankalar[k].id != dataid) {
                            newData.push(kankalar[k]);
                        }
                    
                }
                kankalar = newData;
                dataUpdate();
                dataSet();
                dataCheck();
            });
            $('.list.friends li .arrow').click(function () {
                var dataid = $(this).parents('li:first').attr('data-id');
                var toData = [];
                for (var k in kankalar) {
                    
                        if (kankalar[k].id == dataid) {
                            toData.push(kankalar[k]);
                        }
                    
                }
                if( !jQuery.isEmptyObject(toData) ){
                    gonder(toData);
                }
            });
        }
    },
    isEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
	
	$('.kanka-ekle-formu button').click(function () {
    var isim = $('#isim').val();
    var eposta = $('#eposta').val();


    if (isEmail(eposta)) {
        if (isim == '') {
            isim = eposta;
        }
        var max = 0;
        for (var k in kankalar) {
            
                if (kankalar[k].id > max) {
                    max = kankalar[k].id;
                }
            
        }

        var obj = {};
        obj.id = max + 1;
        obj.isim = isim;
        obj.eposta = eposta;
        kankalar.push(obj);
        dataSet();
        dataUpdate();
        dataCheck();
        $('#isim').val('');
        $('#eposta').val('');
        $('#geridon').click();
    } else {
        alert("E-posta hatalı!");
    }
});

$('#kankaekle').click(function () {
    $('.panel1').hide();
    $('.panel3').hide();
    $('.panel2').show();
});
$('#ayarlarim').click(function () {
    $('.panel1').hide();
    $('.panel2').hide();
    $('.panel3').show();
});

$('#geridon,#geridon2').click(function () {
    $('.panel3').hide();
    $('.panel2').hide();
    $('.panel1').show();
});

$('#ekle').click(function () {
    $('#isim').show();
});

$('.sendtoall').click(function () {
    $('.sendtoall').hide();
    gonder(kankalar);
});

var gonder = function(gideceklistesi){
    urlUpdate();
    var sendData = {
        myname: localStorage["myname"],
        myemail: localStorage["myemail"],
        url: url,
        todata: gideceklistesi
    };
    $.ajax({
        type: "POST",
        url: 'http://aertas.com/kankaext/kankayagonder.php',
        data: sendData,
        success: function () {
            alert("İşlem tamam kanka");
			$('.sendtoall').show();
        }
    });

};



$('.ayarlarim-formu button').click(function () {
    localStorage["myname"] = $('#myname').val();
    localStorage["myemail"] = $('#myemail').val();
    $('#geridon2').click();
});


/* Başlangıçta çalışacaklar */
$(function () {
    urlUpdate();
    dataGet();
    $('#myname').val(localStorage["myname"]);
    $('#myemail').val(localStorage["myemail"]);

});


