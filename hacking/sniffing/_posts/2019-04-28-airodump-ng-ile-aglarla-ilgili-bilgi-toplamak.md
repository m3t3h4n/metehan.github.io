---
layout: post
title: airodump-ng ile ağlarla ilgili bilgi toplamak
categories: [Hacking, Sniffing]
tags: [Hacking, Sniffing]
image: /assets/img/hacking/airodump-ng.png
description: >
  Merhabalar, bu yazımda sizlere ***airodump-ng*** frameworkü ile ağları incelemeyi ve belli bir ağa özel bilgi edinmeyi anlattım.
comments: true
---

Ağlara saldırmadan önce, bu ağların içinde neler olup bitiyor ilk önce bunları gözlemlememiz gerek. Bu olaya ***sniffing*** deniyor.
airodump-ng frameworkü ise bu ağlara gelen giden paketleri incelememizi sağlayan ve bu ağların nasıl ayarlandığını bize gösteren bir framework'dür.

İlk önce wireless kartımızı monitor moda almamız gerekiyor. Monitor modun ne olduğunu ve nasıl geçileceğini bilmeyenler [buradan]({{ '/hacking/sniffing/2019-04-27-monitor-moda-gecme/' | relative_url }}) monitor mod nedir ve nasıl geçilir öğrenebilirler.
~~~bash
root@m3t3h4n:~# airmon-ng start wlan0
~~~
Monitor moda geçtikden sonra terminale şu komutu yazalım:
~~~bash
root@m3t3h4n:~# airodump-ng <interface_adı>
~~~
![airodump-ng](/assets/img/hacking/20190428141021-800x714.png)
Görüldüğü üzere airodump-ng frameworkü etrafdaki wireless ağlarını listelemeye başladı.
{:.figure}
Menzil içerisindeki tüm access pointlerin BSSID'lerini, güçlerini, işaretçi kare sayılarını, veri paketlerinin sayısını, kanal numaralarını, hızlarını, şifreleme yöntemlerini, şifre türlerini, kimlik doğrulama yöntemlerini ve son olarakda ESSID'lerini bize gösterdi.

Gerekli bilgileri edindikden sonra `CTRL+C` yaparak aramayı durdurabilirsiniz.

Bunların arasından bizim işimize yarayacak olanların, ne olduğuna dair kısa bir açıklama yapma zorunluluğu hissettim.
#### BSSID
Basic Service Set Identifier - Temel Hizmet Takımı Tanımlayıcısı: Her kablosuz aygıt için benzersiz bir tanımlayıcı yani kablosuz aygıtın MAC adresidir. İleride yapacağımız saldırılarda bize lazım olacaktır.
#### CH
Channel(kanal): Wireless ağının kullandığı kanaldır.Toplam 13 kanaldan oluşur. Bu kanallar frekans anlamına da gelir. Her bir kanal aslında farklı bir frekans bandını temsil etmektedir. Routerin yayını hangi frekanstan yapacağı bu belirlenen kanal ile ilgili değişim gösterir.Eğer ortamda çok fazla kablosuz ağ varsa sorun olasılığını en aza indirmek için en az kullanılan kanal tercih edilmelidir.
#### ENC
Encryption(Şifreleme): Wireless ağının şifreleme protokolü türüdür.
#### PSK
Pre shared key : Şifreleme protokolünün kullandığı paroladır.
#### ESSID
Service set Identifier : kablosuz ağları veya bağlantı noktalarının kimliğini tanımaya yardımcı olan isimlerdir.Kısaca wireless ağının ismidir.

## Belli Bir Ağa Özel Bilgi Edinmek
Şimdi belirli bir ağ seçelim. Seçtiğimiz ağda kimlerin bağlı olduğunu ve neler yaptıklarını rahatlıkla görebileceğiz.
Ben kendi ağımı seçiyorum. Kendi ağımı seçmemin nedeni, konunun genel hatlarını daha kolay ve daha
anlaşılır olarak anlatabilmektir.

Dinleyeceğimiz ağı seçtikden sonra terminale şu komutu yazalım:
~~~bash
root@m3t3h4n:~# airodump-ng --channel <channel> --bssid <bssid> --write <file_name> <interface>
~~~
`--channel` hedef ağın kanal numarasını `--bssid` hedef ağın bssid'sini `<interface>` ise wireless kartımızın arayüz adını temsil etmektedir.
`--write` dinleme anında yakalanan şifreli paketleri, adını `test` olarak belirttiğimiz dosyaya kaydetmemize yarayacak bir argümandır.
Böylece, sonradan bu dosyayı istediğimiz gibi analiz edip hedef ağın şifresini kırabileceğiz. İlerleyen yazılarımda bu dosyayı nasıl kullanacağımızı anlatacağım.
İsterseniz bu parametreyi yazmadan da kullanabilirsiniz.

![airodump-ng](/assets/img/hacking/20190428153019-803x500.png)
Görüldüğü gibi airodump-ng, tek bir ağa odaklanan bir dinleme yapmaya başladı.
{:.figure}
İlk satırdaki bilgiler bizim hedef aldığımız routerin bilgileri.
Alt tarafda ise, routera kablosuz olarak bağlı olan clientlerin MAC adresleri yer alıyor. Burada edindiğimiz bilgiler güçlü ve işimize
yarayacak olan bilgiler. Eğer hedefimiz bu ağın içindeyse, ona göre saldırılarımızı planlayabiliriz. Ağlara bağlanmaktaki amacımız da
hedef clientlerle aynı ağda olmak ve böylece onlara saldırılar düzenleyebilmektir.
Gerekli bilgileri edindikden sonra `CTRL+C` yaparak dinlemeyi durdurabilirsiniz.

airodump-ng frameworkünün yardım ekranını kullanarak diğer saldırı seçeneklerinide görebilirsiniz.
~~~bash
root@m3t3h4n:~# airodump-ng --help
~~~
![airodump-ng](/assets/img/hacking/20190428161806-801x339.png)

Bu seçenekler arasında:
* deauth
* fake deauth
* interactive
* arpreplay
* chopchop
* fragment
* caffe-latte

gibi diğer saldırı seçenekleride mevcut. Bu tür saldırıları ilerleyen yazılarımda sizlerle paylaşacağım.

[airodump-ng frameworkünün videolu anlatımına buradan ulaşabilirsiniz..](https://youtu.be/0eZfGBbRkJY)

<iframe width="853" height="480" src="https://www.youtube.com/embed/0eZfGBbRkJY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


Bir sonraki yazımda görüşmek üzere klasik kapatma sözleri falan filan..