### Code-Relikte

- Der gesamte Ordner **plot/** ist nicht in Nutzung. Hier sollte die Evaluation der Modelle grafisch geschehen, indem man die Fehlerentwicklung gegen die Rundenzeit live während des Trainings in einem eigenen Fenster plottet. Dies konnte jedoch leider nicht fertiggestellt werden.

- **save-load-file/splitData** enthält Funktionen zum Aufteilen der Eingabematrizen in Test und Trainingsmatrizen. Dafür gibt es verschiedene Methoden:
        setAllMatricesToTrainMatrix um keine Testmatrizen mehr zu haben (reset Funktion)
        
    
      getRandomSubarray
      
      getRandomSubarray(arr,size)
      
      getLastElements(arr, size)
      
      getFirstElements(arr, size)
      
      getEveryNthElement(arr,percentage) 
      
      setTestMatrices
      
      printAllMatrices
  
  Die Namen der Funktionen sollten selbsterklärend sein und sind im Code gut dokumentiert. Man kann also eine zufällige Auswahl der Testmatrizen vornehmen, die ersten oder letzten n-Matrizen oder jede n-te Matrix. Die Auswahl wird in einem Attribut der Matrizen gespeichert aber im weiteren nicht mehr genutzt, weshalb es sich um ein Relikt handelt.
