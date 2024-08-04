const fs = require('fs');

const cevaplayıcı = (chat_id, gelen_mesaj, gönderen_kişi) => {

    var selam_listesi = ["selam", "merhaba", "hoşgeldin" ];
    var son_hal = ""; 
    var rastgele = Math.floor(Math.random() * selam_listesi.length);
    
    const simdikiZaman = new Date();
    const tarihBilgisiJson = `${simdikiZaman.getDate()}/${simdikiZaman.getMonth() + 1}/${simdikiZaman.getFullYear()}`;
    
    const mesaj_içeriği = gelen_mesaj.toLowerCase().split(" ");
    
    var kendinden_bahset = "3 ev arkadaşının birbirlerine olan borçlarını karıştırması üzerine 15.11.2023 tarihinde resmi olarak hizmet vermeye başladım. Amacım ev ile ilgili ilgisiz tüm hesap kitap geçmişini ve borç dağılımını hesaplamak ve kaydetmek. Harcama kayıtlarını tutabilmem için gereken alt yapı 30.11.2023 tarihindeki en yeni güncelleme ile sağlandı. Amatör bir insan ürünü olduğumdan ötürü hata verme ihtimalime karşı kullanan kişilerin harcamalarını bireysel olarak not etmesini ya da mesaj geçmişini silmemesini öneririm.";
    var help_et = "arkadaşlarına olan borçlarını görmek için 'borcumu söyle' , geçmişte yapılan alışverişleri incelemek için 'alışveriş listesi' demen yeterli. Eğer bu borçları ödemek istiyorsan <bö> komutunu yazıp yanına kime ödeyeceğini ve ne kadar ödeyeceğini belirtmelisin. Alışveriş yaptıysan ve bunu kayıt listesine aldırmak istiyorsan <av> yazıp yanına ne hakkında alış veriş yaptığını ve ne kadar harcadığını (rakamlarla) yazmalısın. Benim hakkımda bilgi almak istiyorsan 'kendinden bahset' demen yeterli :)";



    //data base fonksiyonları---------------
    function loadJSON(filename = '') {
        return JSON.parse(
            fs.existsSync(filename)
                ? fs.readFileSync(filename).toString()
                : '""'
        );
    }

    const data = loadJSON('veri_borç_defteri.json');

    function saveJSON(filename = '', json = '""') {
        return fs.writeFileSync(filename, 
        JSON.stringify(
            json,
            null,
            2))
    }
    //data---------------------------------


    //user_1'in hesabı
    if (chat_id == "user_ID") {
    
        if // kullanıcı borçlu olduğu kişileri ve borç miktarını öğrenir
        (mesaj_içeriği.includes("borcumu") && mesaj_içeriği.includes("söyle")) {
            
            son_hal = "user_2'in sana olan borcu: "+data.borclar[0].borc+"tl. user_3'ın sana olan borcu: "+data.borclar[1].borc+"tl."; 

        }else if //kullanıcı arkadaşlarına borç ödemesinde bulunur
        (mesaj_içeriği.includes("<bö>")) {

            var bulunanSayi_2 = gelen_mesaj.match(/\b\d+\b/);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi_2[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var bulunan_sayı_int = parseFloat(bulunanSayi_2);
                    
                    if(mesaj_içeriği.includes("user_2")){

                        data.borclar[0].borc += bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_2 adlı arkadaşına "+bulunanSayi_2[0]+ "tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else if (mesaj_içeriği.includes("user_3")){

                        data.borclar[1].borc += bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_3 adlı arkadaşına "+bulunanSayi_2[0]+"tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else{son_hal = "lütfen borcunuzu ödemek istediğin kişinin adını tam yazınız!"}
                }
            }

        }else if//kullanıcı yaptığı alışveriş neticesinde ödediği parayı kayıt altına alınması ve arkadaşlarına paylaştırılması için bildirir
        (mesaj_içeriği.includes("<av>")) {
                        
            var bulunanSayi = gelen_mesaj.match(/\b\d+\b/);
            var bulunan_sayı_int_2 = parseFloat(bulunanSayi);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var herkese_düşen_pay = parseInt(bulunan_sayı_int_2/3); 

                    data.borclar[0].borc += herkese_düşen_pay;
                    data.borclar[1].borc += herkese_düşen_pay;

                    data.kayıtlar.push({"arkadas": gönderen_kişi, "fiyat": mesaj_içeriği[x] , "açıklama": birleştir , "tarih": tarihBilgisiJson});

                    setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                    son_hal = birleştir+" ile ilgili "+mesaj_içeriği[x]+" liralık alışveriş kaydın alındı ve ev arkadaşlarına düşen pay borç defterine yazıldı. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!";

                }
            }
        
        }else if //kullanıcı yapılan alışveriş kaydını öğrenmek ister
        (mesaj_içeriği.includes("alışveriş") && mesaj_içeriği.includes("listesi"))
        {
            let alışveriş_listesi = [];

            let z = data.kayıtlar.length - 10; 

            if(z < 0){
                z = 0;
            }
            
            while(z < data.kayıtlar.length)
            {
                alışveriş_listesi.push((z+1)+". "+data.kayıtlar[z].arkadas+", "+data.kayıtlar[z].fiyat+"TL tutarında "+data.kayıtlar[z].tarih+" tarihinde "+data.kayıtlar[z].açıklama+" ile alakalı bir alışveriş yaptı.");
                z++;
            }

            son_hal = alışveriş_listesi.join('                                                                                                                                                                                                                                                                                                                     ');

        }else if //kullanıcı selam verir 
        (mesaj_içeriği.includes(selam_listesi[0]) || mesaj_içeriği.includes(selam_listesi[1]))
        {
            son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". ";

        }else if(mesaj_içeriği.includes("help")){

            son_hal= help_et;

        }else if(mesaj_içeriği.includes("kendinden") && mesaj_içeriği.includes("bahset")){

            son_hal=kendinden_bahset;

        }else//kullanıcı herhangi bir şey söyler
        {
            son_hal = son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". Herhangi bir işlem için lütfen beni kullanmaktan kaçınma. Yazdığın mesajaları idrak etmem ve işlem yapmam 3 saniye kadar sürebilir dolayısıyla benim ile konuşurken lütfen sabırlı ol. Eğer nasıl işlem yapman gerektiğini bilmiyorsan 'help' yazarak botu kullanma kılavuzunu görebilirsin.";
        }

    }else if
    //user_2'in hesabı
    (chat_id == "user_ID") {

        if // kullanıcı borçlu olduğu kişileri ve borç miktarını öğrenir
        (mesaj_içeriği.includes("borcumu") && mesaj_içeriği.includes("söyle")) {

            son_hal = "user_1'in sana olan borcu: "+-data.borclar[0].borc+"tl. user_3'ın sana olan borcu: "+-data.borclar[2].borc+"tl."; 

        }else if //kullanıcı arkadaşlarına borç ödemesinde bulunur
        (mesaj_içeriği.includes("<bö>")) {

            var bulunanSayi_2 = gelen_mesaj.match(/\b\d+\b/);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi_2[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var bulunan_sayı_int = parseFloat(bulunanSayi_2);
                    
                    if(mesaj_içeriği.includes("user_1")){

                        data.borclar[0].borc += -bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_1 adlı arkadaşına "+bulunanSayi_2[0]+ "tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else if (mesaj_içeriği.includes("user_3")){

                        data.borclar[2].borc += -bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_3 adlı arkadaşına "+bulunanSayi_2[0]+"tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else{son_hal = "lütfen borcunuzu ödemek istediğin kişinin adını tam yazınız!"}
                }
            }

        }else if//kullanıcı yaptığı alışveriş neticesinde ödediği parayı kayıt altına alınması ve arkadaşlarına paylaştırılması için bildirir
        (mesaj_içeriği.includes("<av>")) {
                        
            var bulunanSayi = gelen_mesaj.match(/\b\d+\b/);
            var bulunan_sayı_int_2 = parseFloat(bulunanSayi);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var herkese_düşen_pay = parseInt(bulunan_sayı_int_2/3); 

                    data.borclar[0].borc += -herkese_düşen_pay;
                    data.borclar[2].borc += -herkese_düşen_pay;

                    data.kayıtlar.push({"arkadas": gönderen_kişi, "fiyat": mesaj_içeriği[x] , "açıklama": birleştir , "tarih": tarihBilgisiJson});

                    setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                    son_hal = birleştir+" ile ilgili "+mesaj_içeriği[x]+" liralık alışveriş kaydın alındı ve ev arkadaşlarına düşen pay borç defterine yazıldı. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!";

                }
            }
        
        }else if //kullanıcı selam verir 
        (mesaj_içeriği.includes(selam_listesi[0]) || mesaj_içeriği.includes(selam_listesi[1]))
        {
            son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". ";

        }else if //kullanıcı yapılan alışveriş kaydını öğrenmek ister
        (mesaj_içeriği.includes("alışveriş") && mesaj_içeriği.includes("listesi"))
        {
            let alışveriş_listesi = [];

            let z = data.kayıtlar.length - 10; 

            if(z < 0){
                z = 0;
            }
            
            while(z < data.kayıtlar.length)
            {
                alışveriş_listesi.push((z+1)+". "+data.kayıtlar[z].arkadas+", "+data.kayıtlar[z].fiyat+"TL tutarında "+data.kayıtlar[z].tarih+" tarihinde "+data.kayıtlar[z].açıklama+" ile alakalı bir alışveriş yaptı.");
                z++;
            }

            son_hal = alışveriş_listesi.join('                                                                                                                                                                                                                                                                                                                     ');

        }else if(mesaj_içeriği.includes("help")){

            son_hal=help_et;

        }else if(mesaj_içeriği.includes("kendinden") && mesaj_içeriği.includes("bahset")){

            son_hal=kendinden_bahset;

        }else//kullanıcı herhangi bir şey söyler
        {
            son_hal = son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". Herhangi bir işlem için lütfen beni kullanmaktan kaçınma. Yazdığın mesajaları idrak etmem ve işlem yapmam 3 saniye kadar sürebilir dolayısıyla benim ile konuşurken lütfen sabırlı ol. Eğer nasıl işlem yapman gerektiğini bilmiyorsan 'help' yazarak botu kullanma kılavuzunu görebilirsin.";
        }

    }else if
    //user_3'ın hesabı
    (chat_id == "user_ID") {

        if // kullanıcı borçlu olduğu kişileri ve borç miktarını öğrenir
        (mesaj_içeriği.includes("borcumu") && mesaj_içeriği.includes("söyle")) {

            son_hal = "user_2'in sana olan borcu: "+data.borclar[2].borc+"tl. user_1'in sana olan borcu: "+-data.borclar[1].borc+"tl."; 

        }else if //kullanıcı arkadaşlarına borç ödemesinde bulunur
        (mesaj_içeriği.includes("<bö>")) {

            var bulunanSayi_2 = gelen_mesaj.match(/\b\d+\b/);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi_2[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var bulunan_sayı_int = parseFloat(bulunanSayi_2);
                    
                    if(mesaj_içeriği.includes("user_2")){

                        data.borclar[2].borc += bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_2 adlı arkadaşına "+bulunanSayi_2[0]+ "tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else if (mesaj_içeriği.includes("user_1")){

                        data.borclar[1].borc += -bulunan_sayı_int;
                        setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                        son_hal="user_1 adlı arkadaşına "+bulunanSayi_2[0]+"tl tutarında borç ödedin. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!" ;

                    }else{son_hal = "lütfen borcunuzu ödemek istediğin kişinin adını tam yazınız!"}
                }
            }

        }else if//kullanıcı yaptığı alışveriş neticesinde ödediği parayı kayıt altına alınması ve arkadaşlarına paylaştırılması için bildirir
        (mesaj_içeriği.includes("<av>")) {
                        
            var bulunanSayi = gelen_mesaj.match(/\b\d+\b/);
            var bulunan_sayı_int_2 = parseFloat(bulunanSayi);

            for(x=0; x < mesaj_içeriği.length; x++){
                
                if(bulunanSayi[0] == mesaj_içeriği[x])
                {
                    var miktar_index = mesaj_içeriği.indexOf(mesaj_içeriği[x]);
                    var öncekiler = mesaj_içeriği.slice(0, miktar_index);
                    var sonrakiler = mesaj_içeriği.slice(miktar_index + 1);
                    var birleştir = öncekiler.concat(sonrakiler).join(" ");

                    var herkese_düşen_pay = parseInt(bulunan_sayı_int_2/3); 

                    data.borclar[1].borc += -herkese_düşen_pay;
                    data.borclar[2].borc += herkese_düşen_pay;

                    data.kayıtlar.push({"arkadas": gönderen_kişi, "fiyat": mesaj_içeriği[x] , "açıklama": birleştir , "tarih": tarihBilgisiJson});

                    setTimeout(function () {saveJSON('veri_borç_defteri.json' , data);} , 3000);

                    son_hal = birleştir+" ile ilgili "+mesaj_içeriği[x]+" liralık alışveriş kaydın alındı ve ev arkadaşlarına düşen pay borç defterine yazıldı. Şu anki borcunu öğrenmek için 'borcumu söyle' demen yeterli!";
                }
            }
        
        }else if //kullanıcı selam verir 
        (mesaj_içeriği.includes(selam_listesi[0]) || mesaj_içeriği.includes(selam_listesi[1]))
        {
            son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". ";

        }else if //kullanıcı yapılan alışveriş kaydını öğrenmek ister
        (mesaj_içeriği.includes("alışveriş") && mesaj_içeriği.includes("listesi"))
        {
            let alışveriş_listesi = [];

            let z = data.kayıtlar.length - 10; 

            if(z < 0){
                z = 0;
            }
            
            while(z < data.kayıtlar.length)
            {
                alışveriş_listesi.push((z+1)+". "+data.kayıtlar[z].arkadas+", "+data.kayıtlar[z].fiyat+"TL tutarında "+data.kayıtlar[z].tarih+" tarihinde "+data.kayıtlar[z].açıklama+" ile alakalı bir alışveriş yaptı.");
                z++;
            }

            son_hal = alışveriş_listesi.join('                                                                                                                                                                                                                                                                                                                     ');

        }else if(mesaj_içeriği.includes("help")){

            son_hal=help_et;

        }else if(mesaj_içeriği.includes("kendinden") && mesaj_içeriği.includes("bahset")){

            son_hal=kendinden_bahset;

        }else//kullanıcı herhangi bir şey söyler
        {
            son_hal = son_hal = selam_listesi[rastgele] + " " + gönderen_kişi + ". Herhangi bir işlem için lütfen beni kullanmaktan kaçınma. Yazdığın mesajaları idrak etmem ve işlem yapmam 3 saniye kadar sürebilir dolayısıyla benim ile konuşurken lütfen sabırlı ol. Eğer nasıl işlem yapman gerektiğini bilmiyorsan 'help' yazarak botu kullanma kılavuzunu görebilirsin.";
        }

    }else {son_hal = "Üzgünüm "+gönderen_kişi+" siz bu eve dahil değilsiniz."}

    console.log(son_hal);
    return son_hal;
}

module.exports = cevaplayıcı;