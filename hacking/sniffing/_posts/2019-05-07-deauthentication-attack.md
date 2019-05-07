---
layout: post
title: Deauthentication Attack
categories: [Hacking, Sniffing]
tags: [Hacking, Sniffing]
image: /assets/img/hacking/deauthentication-attack.jpeg
description: >
  Merhabalar, bu yazımda sizlere aireplay-ng ile ***deauthentication attack*** yani kullanıcıyı networkden koparma saldırısını anlatacağım.
comments: true
---

Bir ağın şifresini bilsekde bilmesekde, aslında istediğimiz kullanıcıyı ağdan koparma yetkisine sahibiz.
Bir client bağlı olduğu kablosuz ağ ile olan bağlantısını koparmak istediğinde aslında istemci kablosuz ağa bir deauthentication
paketi gönderir ve bağlantıyı sonlandırır. 

Eğer biz başkalarının bağlı olduğu herhangi bir wireless ağına deauthentication paketleri gönderirsek yada başkasının adına sanki o kullanıcıymış gibi deauthentication paketleri gönderirsek kurbanın bağlantısı sürekli olarak kopacaktır. 

![deauth-packet](/assets/img/hacking/deauthentication-packet.png)
Örnek bir deauthentication paketi
{:.figure}

Bu saldırı yerinde kullanıldığında çok faydalı olabilecek bir saldırı türüdür. Çünkü kullanıcıyı birden fazla nedenden dolayı ağdan
düşürmek isteyebiliriz.

Bu saldırıyı yapmamızdaki asıl amaç ağa bağlı olan kullanıcının bağlantısını kopartarak modemle tekrar iletişim haline geçerken
yollayacağı handshake paketini yakalamaktır. WPA/WPA2 ile şifrelenmiş bir kablosuz ağın şifresini kırabilmek için de access pointin
4'lü el sıkışma (TCP 4 Way Handshake) dediğimiz paketleri yakalamamız gerekmektedir. 

Handshake paketleri istemcinin, access pointe bağlanırken dörtlü el sıkışma olduğu sırada oluşturulduğundan, herhangi bir istemcinin access pointe bağlanması gerekmektedir. Handshake yakalamanın yolu da herhangi bir kullanıcının ağa bağlanmasını beklemek, yada bağlı olan kullanıcıyı deauthentication saldırısı ile ağdan koparıp tekrar ağa bağlanırken, dörtlü el sıkışmanın gerçekleştiği sırada handshake paketlerini yakalayıp kaydetmektir.

Saldırıya başlamadan önce, saldıracağım access pointi dinleyerek MAC adresini öğrenmem gerekiyor. Bunun için ilk önce monitor moda geçiyorum. Yani wireless kartımı dinleme moduna alıyorum.
>Monitor modun ne olduğunu ve nasıl monitor moda geçileceğini bilmeyenler [buradaki]({{ '/hacking/sniffing/2019-04-27-monitor-moda-gecme/' | relative_url }}) yazımı okuyarak monitor moda geçebilirler.

~~~bash
root@m3t3h4n:~# airmon-ng start <interface>
~~~
![720x464](/assets/img/hacking/20190428002604-720x464.png)

Monitor moda geçtikten sonra hedef access pointin MAC adresini öğrenmek için airodump-ng frameworkü ile etrafımdaki ağları dinlemeye başlıyorum.
>airodump-ng frameworkü hakkında bilgi sahibi değilseniz [buradan]({{ '/hacking/sniffing/2019-04-28-airodump-ng-ile-aglarla-ilgili-bilgi-toplamak/' | relative_url }}) airodump-ng hakkında bilgi sahibi olabilirsiniz.

~~~bash
root@m3t3h4n:~# airodump-ng <interface>
~~~
![800x714](/assets/img/hacking/20190428141021-800x714.png)
airodump-ng çevremdeki access pointleri listelemeye başladı.
{:.figure}

Hedef access pointimin MAC adresini öğrendikden sonra, ağdaki clientlerin MAC adresini öğrenmek için o ağa özel bir dinleme yapıyorum.

~~~bash
root@m3t3h4n:~# airodump-ng --channel <channel> --bssid <bssid> <interface>
~~~
![803x500](/assets/img/hacking/20190428153019-803x500.png)
Ağdaki clientlerin MAC adresi
{:.figure}
Gerekli bilgileri edindikden sonra saldırımıza başlayabiliriz. Ben kendi ağıma saldırı düzenleyeceğim. Kendi ağımı seçmemin nedeni konunun genel hatlarını daha kolay ve daha anlaşılır bir şekilde anlatabilmektir. Terminale şu komutu yazalım :

~~~bash
root@m3t3h4n:~# aireplay-ng --deauth <packets> -a <access_point_MAC> <interface>
~~~
![803x500](/assets/img/hacking/20190507162550-829x447.png)
aireplay-ng hedef access pointe ve ağdaki clientlerin hepsine ***deauth*** paketleri göndermeye başladı.
{:.figure}
Yukarıdaki komut sadece hedef access pointe bağlı bütün kullanıcıların bağlantılarını kesmeye yönelik bir ataktı. Eğer hedef access pointe bağlı belirli bir clientin bağlantısını kesmek istiyorsak terminale aşağıdaki komutu yazmalıyız;

~~~bash
root@m3t3h4n:~# aireplay-ng --deauth <packets> -a <access_point_MAC> -c <client_MAC> <interface>
~~~
![832-447](/assets/img/hacking/20190507164045-832x447.png)

aireplay-ng bu sefer hedef ağa ve ağdaki belirli bir cliente deauthentication paketleri göndermeye başladı.

* `--deauth` parametresi deauthentication saldırısı yapılacağını,
* `<packets>` ise hedef access pointe gönderilecek olan paket sayısını belirtiyor. Eğer hedefinizin bir anlık kısa bir süreliğine 
bağlantısını kesmek istiyorsanız `<packets>` parametresi yerine 5 yada 10 gibi küçük değerler girerek bir anlık kopma yaşatabilirsiniz. Yada hedef access pointin bağlantısını sürekli kesmek istiyorsanız `<packets>` parametresi yerine 5000 - 10000 gibi yüksek değerler girip hedefi deauth paketlerine boğarak sürekli bağlantısını kesebilirsiniz. Bu tamamen sizin amacınıza kalmış birşey.
* `-a` parametresi `<access_point>` argümanı yerine yazacağınız hedef access pointin MAC adresini,
* `-c` parametresi ise `<client>` argümanı yerine yazılacak olan hedef clientin MAC adresini,
* `<interface>` ise wireless kartınızın interface adını temsil ediyor.

Saldırı başladıktan sonra kurbanın ağ ile bağlantısı kesilmiş olacaktır. airodump-ng ekranına tekrar dönerseniz hedefinizin ağdan kopmuş olduğunu göreceksiniz.

Bir sonraki yazımda görüşmek üzere.