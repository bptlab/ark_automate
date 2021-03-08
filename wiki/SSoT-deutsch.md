# Single Source of Truth

### Sammler: Welche Frontends wollen wir supporten?
- definitiv implementiert werden: BPMN-Editor, Robot-Framework Code-Editor
- optional (geplant) sind: Google BLOCKLY
- langfristig sind wir offen für andere Modellierungssprachen 

(_Wir wollen alle Modellierungssprachen, die sich in ein  Kanten- und Knoten-Modell rendern lassen, unterstützen_)

Feststellung: Alle Frontends, die "ausführbaren Programmcode" abbilden, können als Graph dargestellt werden.

### Analyse: Was kann Robot Framework alles unterstützen?
- Linearer Flow (Sequenzen)
- Verzweigung
- Loops (For+While)
**Unterstützt nicht:** Try-Catch Konstrukte


### Wir haben uns auf folgendes geeinigt
- **Speichern der SSoT**
    - die lokale SSOT wird nach Interval (bzw. Trigger wie "Tab wechseln") in die DB gepusht
    - die SSoT speichert nur die Logik hinter den Mod-Interfaces 
(die visuelle Darstellung wird aus dem Graphen "gerendert")
- Es werden nur diese Features der Modellierungssprachen zugelassen, die durch **Robot Framework unterstützt werden**
    - Parallelität wird nicht unterstützt
    - Es werden keine Gateways außer ein XOR Split in der SSOT festgehalten
( => non-interrupting Events werden nicht unterstützt)
    - Exception-Handling wird nicht unterstützt 
(=> daher unterstützen wir in BPMN keine Zwischenereignisse)
- **Frontend-Rendering**
    - erfordert eine umfangreiche Programmierung
    - kann u.U. dafür sorgen, das der Programmierer sein Modell anders angezeigt bekommt, als er es abgespeichert hat
    - benötigte Hard-Coded-Values für das Frontend-Rendering werden in `config.json` abgelegt


### kurz-FAQ:
1. Speichern wir in der SSoT Informationen zu jedem Modell oder "rendern" wir jedes Modell aus der SSoT ohne spezifische Modellinformationen in der SSoT hinterlegt zu haben?
    1. Wir rendern jedes Modell aus unserem "Logik-Graphen"
    2. Es werden somit keine Modellierungs-Interface-spezifischen Werte gespeichert.
    3. Fehlende Attribute, die zur Erstellung einers Modellierungs-Visualisierung benötigt werden, müssen mit default-Werten angenommen oder errechnet werden
4. Verwenden wir das XML als SSOT?
_Nein, wir rendern aus der SSOT die Modelle._
_Für z.B. BPMN rendern wir SSOT zu XML zu BPMN?_
5. Wie speichern wir die Kanten aus BPMN?
_Implizit durch die Nachfolger/Vorgänger-Beziehungen. Die genauen Waypoints müssen "errechnet" werden._
6. Was für Konsequenzen hat das nicht-Speichern von Modellierungsattributen für unser Projekt? (**BPMN-spezifisch**)
    - exakte Anordnung im Interface wird nicht beibehalten;
jedoch: Unterstützung beim Einhalten des Standards (automatischer Pretty Print)
    - Es wir eine Logik für das Updaten der SSoT nach Löschen (und Hinzufügen) benötigt
    - Config-Dateien mit Größen, Farben, Symbolen etc. werden für jedes Modellierungsinterface benötigt

## Anwendungskonzept SSoT

**Feststellung: SSoT sollte näher an den grundlegenden Programmierkonstrukten sein als an einem BPMN-Modell.**
Daher: Alle Interfaces werden in ein Graphen-Modell gerendert, bei denen die Knoten durch folgende Tags bestimmt werden: `INSTRUCTION`, `BRANCH`, `CASE` und `MARKER`. Diese Tags bilden die grundsätzlichen Programmierkonstrukte ab, die auch im **Robot Framework** verwendet werden können.


### Übersicht
|  SSoT-Tag   |      BPMN-Repräsentation       |  Code-Repräsentation   |      ArkA 0.3      |      ArkA 1.0      |
|:-----------:|:------------------------------:|:----------------------:|:------------------:|:------------------:|
| INSTRUCTION |           Aktivität            |   "eine Zeile Code"    | :heavy_check_mark: | :heavy_check_mark: |
|    CASE     |          XOR-Gateway           | Verzweigung (IF, CASE) |        :x:         | :heavy_check_mark: |
|    LOOP     | XOR-Split & Join (Kombination) | Schleife (FOR, WHILE)  |        :x:         | :heavy_check_mark: |
|   MARKER    |       Start- & End-Event       |           -            | :heavy_check_mark: | :heavy_check_mark: |
| _EXCEPTION_ |      _intermediate Event_      |      _TRY-CATCH_       |        :x:         |        :x:         |

**Besonderheiten bei Events:**
**Timer:** Langfristig sollen Timer in BPMN als Zwischenevent dargestellt werden. Momentan ist beispielhaft ein "Sleep-Event" (zum Pausieren der Ausführung) als Instruction mit einer RPA-Aktion zu definieren.

**Event-Typen:** Diese werden nicht gespeichert. Events erscheinen daher immer als "leere Kreise". Sie sind auch nicht mit Logik verknüpfbar. Soll z.B. ein End-Event eine Mail senden, so ist dieses Konstrukt bitte als `Aktivität: Mail Senden` und `End Event` zu modellieren.
Es werden momentan keine Zwischenevents unterstützt.

### Übersicht SSOT Aufbau
![](https://i.imgur.com/7yOqDZv.png)


### Anwendung: HEADER

Hierbei ändert sich nichts im Vergleich zu Daniels Aufschlag einer SSoT. Nutzer-Informationen zu einem Robot (Ersteller, Freigegeben für etc.) werden in einer zusätzlichen Datei in der Datenbank abgelegt.

**SSoT**
``` json
{"robotMetadata":{
      "robotId":"exampleRobotId",
      "starterId":"exampleId"
   },
   "elements":[
      {/* Hier folgen die Knoten des Graphens */}  
   ]
}
```


### Anwendung: INSTRUCTION

**SSoT**
```json
{
  "type": "INSTRUCTION",
  "name": "exampleName",
  "id": "exampleId",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"],
  "rpaApplication": "e.g. Excel.Files",
  "rpaTask": "e.g. Open Workbook",
  "rpaParameters": [
    {
      "name": "Filename",
      "value": "",
      "requireUserInput": true
    },
    {
      "name": "Path",
      "value": "C:/RPA-folder/",
      "requireUserInput": false
    }
  ],
  "outputVariable": ""
}
```

**BPMN benötigt:**
- id :heavy_check_mark: 
- Label -> name :heavy_check_mark: 
- Vorgänger :heavy_check_mark: 
- Nachfolger :heavy_check_mark: 
- ~~Position~~ -> berechnet :heavy_check_mark: 
- ~~Größe~~ -> `config.json` :heavy_check_mark: 
- _RPA-Task & Application & Parameters_ :heavy_check_mark: 

### Anwendung: CASE

**SSoT speichert**
- Vorgängerknoten, Nachfolgerknoten
- Name, ID
- default-Nachfolgerknoten 
- Conditions (zu jewieligem Nachfolgerknoten) = IF-Bedingung

```json
{
  "type": "CASE",
  "name": "",
  "id": "exampleId",
  "predecessorIds": ["randomId3"],
  "successorIds": ["randomId", "randomId2, randomId3"],
  "default_successorIds": "randomId",
  "conditions": {
      "X+1==3": "randomID",
      "X-1==3": "randomID2"
    }
}
```

**BPMN benötigt**
- Vorgängerknoten :heavy_check_mark: 
- Nachfolgerknoten :heavy_check_mark: 
- Label (name) :heavy_check_mark: 
- default-Nachfolgerknoten :heavy_check_mark: 
- Conditions (Texte am Path zu jedem Nachfolgerknoten) :heavy_check_mark: 

### Anwendung: LOOP

**SSoT speichert**
- ID, Text (Label)
- Vorgänger- und Nachfolgerknoten der Schleife
- Schleifenabbruchbedingung
- Vorgängerknoten des Schleifenkörper-Endes
- Nachfolgerknoten des Schleifenkörper-Anfangs

```json
{
  "type": "LOOP",
  "id": "exampleId",
  "loop_condition": "X > 5",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"],
  "loop_body_predecessorIds": ["randomId"],
  "loop_body_successorIds": ["randomId"]
}
```

### Anwendung: MARKER
**SSoT speichert**
- ID, Text (Label)
- Vorgängerknoten
- Nachfolgerknoten


```json
{
  "type": "MARKER",
  "name": "5 Sekunden warten",
  "id": "exampleId",
  "predecessorIds": ["randomId"],
  "successorIds": ["randomId"]
}
```

**BPMN benötigt**

- Label :heavy_check_mark: 
- Event-Typ1: Start, End :heavy_check_mark: 
    - Start = Event ohne eingehende Kante
    - End = Event ohne ausgehende Kante 
- Event-Typ2: Timer-Event, Message-Event etc. :thought_balloon: 
    - alle Events werden immer als "neutrale Events" (leerer Kreis) gerendert

---



## Beispielhaftes Parsen von BPMN xml zu SSOT
Modellierter Prozess
![](https://i.imgur.com/rMsmw1g.png)


<table>
<tr>
<td> BPMN Json </td> <td> SSOT </td>
</tr>
<tr>
<td> 

``` json
  {
  "_declaration": {
    "_attributes": {
      "version": "1.0",
      "encoding": "UTF-8"
    }
  },
  "bpmn2:definitions": {
    "_attributes": {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:bpmn2": "http://www.omg.org/spec/BPMN/20100524/MODEL",
      "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
      "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
      "xmlns:arkRPA": "http://magic",
      "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
      "id": "sample-diagram",
      "targetNamespace": "http://bpmn.io/schema/bpmn",
      "xsi:schemaLocation": "http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
    },
    "bpmn2:collaboration": {
      "_attributes": {
        "id": "Collaboration_0czsqyr"
      },
      "bpmn2:participant": {
        "_attributes": {
          "id": "Participant_0cyhvx8",
          "processRef": "Process_1"
        }
      }
    },
    "bpmn2:process": {
      "_attributes": {
        "id": "Process_1",
        "isExecutable": "false"
      },
      "bpmn2:task": [
        {
          "_attributes": {
            "id": "Activity_0a128t6",
            "name": "#+# First activity"
          },
          "bpmn2:incoming": {
            "_text": "Flow_1bewk1i"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_0sg07kn"
          }
        },
        {
          "_attributes": {
            "id": "Activity_0ascvdr",
            "name": "#+#+# RPA Activity",
            "arkRPA:application": "Browser",
            "arkRPA:task": "Open Browser",
// added linebreaks for readability
            "arkRPA:inputVars": "{\"url\":\"TestString\",
\"browser\":\"TestString\",
\"alias\":\"TestString\",
\"remote_url\":true,
\"desired_capabilities\":\"TestString\",
\"ff_profile_dir\":\"TestString\",
\"options\":\"TestString\",
\"service_log_path\":\"TestString\",
\"executable_path\":\"TestString\"}",
            "arkRPA:outputVars": ""
          },
          "bpmn2:incoming": {
            "_text": "Flow_0sg07kn"
          },
          "bpmn2:outgoing": {
            "_text": "Flow_1hwcghk"
          }
        }
      ],
      "bpmn2:sequenceFlow": [
        {
          "_attributes": {
            "id": "Flow_1bewk1i",
            "sourceRef": "StartEvent_1",
            "targetRef": "Activity_0a128t6"
          }
        },
        {
          "_attributes": {
            "id": "Flow_0sg07kn",
            "sourceRef": "Activity_0a128t6",
            "targetRef": "Activity_0ascvdr"
          }
        },
        {
          "_attributes": {
            "id": "Flow_1hwcghk",
            "sourceRef": "Activity_0ascvdr",
            "targetRef": "Event_0wghmrz"
          }
        }
      ],
      "bpmn2:endEvent": {
        "_attributes": {
          "id": "Event_0wghmrz"
        },
        "bpmn2:incoming": {
          "_text": "Flow_1hwcghk"
        }
      },
      "bpmn2:startEvent": {
        "_attributes": {
          "id": "StartEvent_1"
        },
        "bpmn2:outgoing": {
          "_text": "Flow_1bewk1i"
        }
      }
    },
    "bpmndi:BPMNDiagram": {
      "_attributes": {
        "id": "BPMNDiagram_1"
      },
      "bpmndi:BPMNPlane": {
        "_attributes": {
          "id": "BPMNPlane_1",
          "bpmnElement": "Collaboration_0czsqyr"
        },
        "bpmndi:BPMNShape": [
          {
            "_attributes": {
              "id": "Participant_0cyhvx8_di",
              "bpmnElement": "Participant_0cyhvx8",
              "isHorizontal": "true"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "130",
                "y": "220",
                "width": "710",
                "height": "250"
              }
            }
          },
          {
            "_attributes": {
              "id": "Activity_0a128t6_di",
              "bpmnElement": "Activity_0a128t6"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "340",
                "y": "280",
                "width": "100",
                "height": "80"
              }
            }
          },
          {
            "_attributes": {
              "id": "Activity_0ascvdr_di",
              "bpmnElement": "Activity_0ascvdr"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "500",
                "y": "280",
                "width": "100",
                "height": "80"
              }
            }
          },
          {
            "_attributes": {
              "id": "Event_0wghmrz_di",
              "bpmnElement": "Event_0wghmrz"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "662",
                "y": "392",
                "width": "36",
                "height": "36"
              }
            }
          },
          {
            "_attributes": {
              "id": "_BPMNShape_StartEvent_2",
              "bpmnElement": "StartEvent_1"
            },
            "dc:Bounds": {
              "_attributes": {
                "x": "212",
                "y": "302",
                "width": "36",
                "height": "36"
              }
            }
          }
        ],
        "bpmndi:BPMNEdge": [
          {
            "_attributes": {
              "id": "Flow_1bewk1i_di",
              "bpmnElement": "Flow_1bewk1i"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "248",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "340",
                  "y": "320"
                }
              }
            ]
          },
          {
            "_attributes": {
              "id": "Flow_0sg07kn_di",
              "bpmnElement": "Flow_0sg07kn"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "440",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "500",
                  "y": "320"
                }
              }
            ]
          },
          {
            "_attributes": {
              "id": "Flow_1hwcghk_di",
              "bpmnElement": "Flow_1hwcghk"
            },
            "di:waypoint": [
              {
                "_attributes": {
                  "x": "600",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "631",
                  "y": "320"
                }
              },
              {
                "_attributes": {
                  "x": "631",
                  "y": "410"
                }
              },
              {
                "_attributes": {
                  "x": "662",
                  "y": "410"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```


</td>
<td>

``` json
"robotMetadata": {
        "robotId": "exampleRobot",
        "starterId": "exampleID"
    },
    "elements": [
        {
            "type": "MARKER",
            "name": "",
            "id": "StartEvent_1",
            "predecessorIds": [],
            "successorIds": ["Activity_0a128t6"],
        },
        // first activity 
        {
            "type": "INSTRUCTION",
            "name": "#+# First activity",
            "id": "Activity_0a128t6",
            "predecessorIds": ["StartEvent_1"],
            "successorIds": ["Activity_0ascvdr"],
            "outputVariable": ""
        },
        // RPA activity
        {
            "type": "INSTRUCTION",
            "name": "#+#+# RPA Activity",
            "id": "Activity_0ascvdr",
            "predecessorIds": ["Activity_0a128t6"],
            "successorIds": ["Event_0wghmrz"],
            "rpaApplication": "Browser",
            "rpaTask": "Open Browser",
            "parameters": [
                {
                    "name": "url",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "browser",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "remote_url",
                    "value": "true",
                    "requireUserInput": true
                },
                {
                    "name": "desired_capabilities",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "ff_profile_dir",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "options",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "service_log_path",
                    "value": "TestString",
                    "requireUserInput": true
                },
                {
                    "name": "executable_path",
                    "value": "TestString",
                    "requireUserInput": true
                },
            ],
            "outputVariable": ""
        },
        // Endevent
        {
            "type": "MARKER",
            "name": "",
            "id": "Event_0wghmrz",
            "predecessorIds": ["Activity_0a128t6"],
            "successorIds": [],
        }
    ]
}
```

</td>
</tr>
</tr>
</table>

## [OLD] Alternative BPMN-nahe SSoT 
``` json
  "robotMetadata": {
    "robotId": "exampleRobotId",
    "starterId": "exampleId"
  },
  "elements": [
    {
      "type": "StartEvent/EndEvent/Activity/InterruptingBoundaryEvent",
      "name": "exampleName",
      "id": "exampleId",
      "predecessorIds": ["randomId"],
      "successorIds": ["randomId"],
      "rpaApplication": "e.g. Excel.Files",
      "rpaTask": "e.g. Open Workbook",
      "rpaParameters": [
        {
          "name": "Filename",
          "value": "example.xlsx",
          "requireUserInput": true
        },
        {
          "name": "Path",
          "value": "C:/example/",
          "requireUserInput": true
        }
      ],
      "outputVariable": "",
      "condition": ["true"],
      "hasBoundaryEvent": "boundaryEventId"
    }
  ]
}
```
