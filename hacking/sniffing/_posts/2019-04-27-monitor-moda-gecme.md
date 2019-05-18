---
layout: post
title: airmon-ng ile monitor moda geçme
categories: [Hacking, Sniffing]
tags: [Hacking, Sniffing]
image: /assets/img/hacking/monitor-mode.jpg
description: >
  Merhabalar, bu yazımda wireless kartımızı `monitor` moda ve `managed` modlara almayı anlattım.
---

İlk önce wireless kartınızın `interface`(arayüz) adını öğrenmemiz gerekiyor.

Terminali açalım ve şu komutu yazalım:
~~~bash
root@m3t3h4n:~# iwconfig
~~~
![iwconfig](/assets/img/hacking/20190427233246-720x463.png)
Görüldüğü üzere benim interface'imin adı `wlan0`. Eğer harici bir wireless kartı kullanıyorsanız sizinki farklı olabilir.
{:.figure}
## Monitor moda geçme
Wireless kartlarımızın farklı modları var. Bunlardan iki tanesi `managed mode` ve `monitor mode`.
### Managed Mode
Managed mod kullandığımız wireles cihazlarında çalışan, istemcilerin hizmet almak için kullandığı moddur.
### Monitor Mode
Bu mod ile wireless kartımızı dinleme durumuna geçirmiş oluyoruz.Etraftaki gelen ve giden paketleri sniff etmek için monitor moda geçilmesi gerekir.

Monitor moda geçmek için ise terminale şu komutu yazalım
~~~bash
root@m3t3h4n:~# airmon-ng start <interface_adı>
~~~
![monitor mod](/assets/img/hacking/20190428002604-720x464.png)
Benim interface'imin adı `wlan0` olduğu için interface bölümüne `wlan0` yazdım. Eğer harici bir wireless kartı kullanıyorsanız sizinki farklı olabilir.
{:.figure}
Çıktı olarak wireless kartımın üzerinde çalışan işlemleri, wireless kartımın interface adını, wireles kartımın driver'ını ve chipset bilgilerini verdi.
>**Not:** Ayrıca wireless kartının üzerinde şu işlemler çalışıyor,
~~~bash
root@m3t3h4n:~# airmon-ng check kill
~~~
komutu ile bu işlemleri sonlandır, o zaman monitor moda geçmek daha garanti olur diye bir çıktı da döndürdü.
Eğer monitor moda geçmekde zorlanıyorsanız bu komutu kullanabilirsiniz.

Monitor moda geçip geçmediğimizi anlamak için ise terminale:
~~~bash
root@m3t3h4n:~# iwconfig
~~~
komutunu tekrar yazıyoruz.

![iwconfig](/assets/img/hacking/20190428015206-722x464.png)
Gelen çıktıda wireless kartımın interface adının değiştiğini, yeni adının `wlan0mon` olduğunu ve `Mode:Monitor` olduğunu görüyoruz.
{:.figure}

Monitor moddan managed moda geri geçmek için ise terminale şu komutu yazabilirsiniz:
~~~bash
root@m3t3h4n:~# airmon-ng stop <yeni_interface_adı>
~~~
![managed mod](/assets/img/hacking/20190428015917-720x462.png)
Gelen çıktıda managed modun tekrar aktif olduğunu ve monitor modun ise pasif olduğunu görüyoruz.
{:.figure}

Managed moda geçip geçmediğinizi görmek için ise terminale tekrar:
~~~sh
root@m3t3h4n:~# iwconfig
~~~
komutunu yazarak `interface` adınızın eski haline döndüğünü görebilirsiniz.