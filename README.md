CUEgenerator
=============
A small utility which facilitates creating cue files from tracklists.

## Tracklist highlights

* In case if a local performer is absent the global one is used, e.g.
![](https://raw.github.com/dVaffection/cuegenerator/master/images/README/global-performer.png)

* Perfomer and title track separators:
    * `' - '` — 45 (hyphen-minus)
    * `' – '` — 8211 (en dash)
    * `' ‒ '` — 8210 (figure dash)
    * `' — '` — 8212 (em dash)
    * `' ― '` — 8213 (horizontal bar)
* Timings recognition:
    * `[08:45] 03. 8 Ball` → `08:45`
    * `01.[18:02] Giuseppe` → `18:02`
    * `10:57 02. Space Manoeuvres` → `10:57`
    * `56:53 T.O.M'` → `56:53`
    * `1:02:28 Mossy` → `62:28`

## Regions list recognition:
* Sony Sound Forge format `dd:dd:dd[.,]dd`
* Adobe Audition format `dd:dd:dd:dd`
* Audacity format `ddddd.dddddd`
