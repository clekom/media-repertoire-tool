# media-repertoire-tool
Das Medienrepertoire-Tool (MRT) ist ein Befragungsinterface zur Erfassung von Medienrepertoires (Mehr zum wissenschaftlichen Hintergrund: https://www.hans-bredow-institut.de/de/projekte/medienrepertoires).
Das Tool habe ich im Rahmen meiner Arbeit am Lehrstuhl für Kommunikations- und Medienwissenschaften der UdK-Berlin entwickelt und steht unter einer Open-Source-Lizenz zur Verfügung.

## Beispiel
Eine beispielhafte Befragung kann unter https://clemenskommerell.de/mrt getestet werden.

## Setup
### Voraussetzungen
Das MRT ist für die Nutzung auf einem herkömmlichen Webspace ausgerichtet. Dabei werden eine Php-Umgebung sowie MySQL-Datenbank mit Schreibrechten vorausgesetzt.

### Konfiguration
Das Repository beinhaltet eine vorkonfigurierte Version mit einer fertigen App im dist-Folder. 
Für die Nutzung müssen dann nur in der Datei db/config.php entsprechende Eintragungen für die Datenbankverbindung vorgenommen werden sowie die Textelemente in der text/texts.json angepasst werden.
Zudem können im Ordner images/icons beliebige Icons hinterlegt werden, die dann von den Probanden sortiert werden. 
Anschließend kann das Tool auf einem Webspace hinterlegt werden. 
Eine Tabelle (mrt) in der angegebenen Datenbank wird automatisch erstellt. 
Wer möchte kann natürlich das Repository clonen und die Dateien beliebig anpassen, alle Dependencies sind in der package.json angegeben und können bspw. über npm install installiert werden. 
Die main.js im dist-Folder wird aus den Dateien im src-Folder über Webpack generiert (npm run build).


