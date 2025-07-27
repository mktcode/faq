# KI für Anfänger

## Vorwort

Künstliche Intelligenz (KI) ist ein wirklich heikles Thema. Es gibt gute Gründe, aus denen viele Menschen skeptisch sind.
Einige Bedenken kann man ausräumen, andere verdienen mehr Aufmerksamkeit und erfordern eine differenzierte Betrachtung und gesellschaftliche oder sogar philosophische Auseinandersetzung.

Bei der Frage des Energieaufwands werden noch für eine Weile Kosten und Nutzen gegenübergestellt werden müssen.
Datensicherheit und Schutz der Privatsphäre sind ebenfalls schwer einzuschätzen, gerade ohne fundierte technische Kenntnisse.
Und die Risiken in der Anwendung werden teilweise erst in der Praxis deutlich.
Macht KI uns dümer? Wie wird sie die Arbeitswelt verändern oder sich auf die Vermögensverteilung auswirken?

Es gibt viele offene Fragen. Fest steht: Die Technologie ist da und wird auch nicht mehr verschwinden. Sie kann nur politisch reguliert und eingeschränkt werden.
Die Frage ist schon lange nicht mehr, ob wir KI nutzen wollen, sondern wie und wie bewusst wir damit umgehen.

Wir wollen daher vor allem interessierten Anfängern und technisch weniger versierten Menschen einen verständlichen Einstieg bieten, etwas Wissen vermitteln und ganz pragmatische Tipps geben.

## Einleitung

Mit KI sind heutzutage vor allem große Sprachmodelle gemeint, die Texte einlesen und generieren können.
Dabei handelt es sich im Kern um ein Computerprogramm (ganz klassisch), das für einen beliebigen Text ein mögliches nächstes Wort anzeigt,
ähnlich wie die Autovervollständigung am Smartphone.

Die klassische Autovervollständigung funktioniert dabei noch ganz einfach.
Ihr Smartphone hat ein Wörterbuch, in dem Wörter nach Häufigkeit sortiert sind.
Tippen Sie "Ver" ein, schlägt es Ihnen "Verkehr", "Vertrag" und "Veranstaltung" vor.

Zu jedem Wort in dem Wörterbuch gibt es dann noch eine Tabelle. In der sind wiederum alle Wörter sortiert aufgelistet, diesmal nach der Häufigkeit, mit der sie auf das erste Wort folgen. Tippen Sie also "Verkehr" ein, stehen in der zugehörigen Tabelle Wörter wie "ist", "stockt" oder "nervt" ganz oben.

Diese Erklärung ist zwar stark vereinfacht, aber es reicht um zu verstehen, dass klasssiche Autovervollständigung noch recht simpel aufgebaut war.
Und wenn der Computer sich immer nur das letzte Wort anschaut, ist die Wahrscheinlichkeit nicht immer sehr hoch, dass die vorgeschlagenen Wörter im Kontext des Satzes wirklich passen. In der Realität wird daher mit komplexeren Tabellen gearbeitet, für ganze Wortfolgen.
Geben Sie "Verkehr sollte" ein, schaut ihr Smartphone in der Tabelle "Verkehr, sollte, ?" nach und findet Wörter wie "fließen", "sicher" oder "reduziert".

Diese Tabellen stellen also komplexe Sprachstatistiken dar, mit Hilfe derer man eine Wahrscheinlichkeit für das nächste Wort berechnen kann.

Nun kann man sich vorstellen, dass das Erstellen dieser Statistiken recht aufwendig wird, wenn man jede erdenkliche Wortfolge berücksichtigen möchte - Ein Fass ohne Boden. Die große KI-Revolution besteht im Grunde darin, dass man hierfür einen Trick gefunden hat:

Man gibt dem Computer die Tabellen für die Statistiken, schier unendlich viele und unendlich große Tabellen, aber alle leer.
Jetzt befüllt der Computer diese Tabellen komplett zufällig. Für jedes Feld wird eine Zahl gewürfelt.
Und dann nutzen wir diese "Schein-Statistik" einfach wie vorher, um die Wahrscheinlichkeit für das nächste Wort zu berechnen.
Das klappt natürlich nicht bzw. die vorgeschlagenen Wörter sind völlig sinnlos.

Und jetzt der Trick: Nochmal würfeln. Und nochmal. Und nochmal. Solange bis mal ein Wort auftaucht, das im Kontext des Satzes passt.
Dann probiert man noch einen ganz anderen Satz und stellt fest, dass es nicht passt.
Also weiter würfeln, solange bis für beide Beispiel-Sätze ein Wort berechnet wird, das passt.

Damit haben Sie KI im Wesentlichen verstanden und auch warum das Training so viel Energie verbraucht.
Es wird gewürfelt, Tag und Nacht, über Wochen und Monate hinweg, bis die Tabellen so befüllt sind, dass sie tatsächlich brauchbare Vorschläge liefern.
Auch hier ist die Erklärung natürlich wieder extrem stark vereinfacht. In der Praxis wird auch nicht immer wieder komplett neu gewürfelt. Es entstehen Tabellen, die für sich genommen schon gut funktionieren und nur noch leichte Anpassungen benötigen, während andere komplett neu befüllt werden müssen.

So nähert man sich Schritt für Schritt dem Ziel, dass diese unvorstellbar riesige Statistik auch für sehr komplexe Wortfolgen, ganze Texte oder sogar Buchkapitel, sinnvolle Vorhersagen über das nächste Wort treffen kann. Und dann hängt man dieses Wort einfach an den Text an und wiederholt das Spielchen. Und schon fängt die KI an, Texte zu generieren, Wort für Wort. Als wenn Sie in der Autovervollständigung einfach die ganze Zeit blind auf das nächste vorgeschlagene Wort tippen würden.

Die stark angezweifelte und am Ende doch glorreiche Theorie war nun: Wenn wir das nur mit genug Beispieltexten machen und den Computer lange genug würfeln lassen, dann entsteht Intelligenz. Für jede beliebige Texteingabe, egal wie lang oder kurz, soll eine sinnvolle Vervollständigung herauskommen.

Das berühmte Paper von Google, "Attention Is All You Need" (zu Deutsch: "Aufmerksamkeit ist alles, was man braucht"), lieferte 2017 den theoretischen Nachweis.
2022 konnte sich dann die ganze Welt davon überzeugen und sich mit ChatGPT über Gott und die Welt unterhalten.

## Was ist 2025 möglich?

Seit dem hat sich einiges getan.

# Beispiele

## Textgenerierung

## Aufgaben