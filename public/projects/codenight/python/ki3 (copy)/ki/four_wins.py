import random as rd
from copy import deepcopy

class FourWins:
    def __init__(self, x, o):
        self.x_player = x
        self.o_player = o
        self.field = [["_", "_", "_", "_", "_", "_", "_"], ["_", "_", "_", "_", "_", "_", "_"],
                      ["_", "_", "_", "_", "_", "_", "_"], ["_", "_", "_", "_", "_", "_", "_"],
                      ["_", "_", "_", "_", "_", "_", "_"], ["_", "_", "_", "_", "_", "_", "_"]]

    def start(self):
        n = 0
        self._print_field()
        while True:
            n += 1
            print(f'Spielzug {n}')
            if n % 2 == 1:
                c = self.x_player(deepcopy(self.field), "X")
                if self.field[0][c] != "_":
                    print("Die Spalte ist bereits voll!")
                else:
                    self._insert(c,"X")
                    self._print_field()
                if self._check_win("X"):
                    print("X hat gewonnen")
                    return "X"
                elif self._check_draw():
                    print("Unentschieden")
                    return "_"
            else:
                c = self.o_player(deepcopy(self.field), "O")
                if self.field[0][c] != "_":
                    print("Das Feld ist bereits belegt!")
                else:
                    self._insert(c,"O")
                    self._print_field()
                if self._check_win("O"):
                    print("O hat gewonnen")
                    return "O"
                elif self._check_draw():
                    print("Unentschieden")
                    return "_"

    def _start_wo_print(self):
        n = 0
        while True:
            n += 1
            if n % 2 == 1:
                c = self.x_player(deepcopy(self.field), "X")
                if self.field[0][c] != "_":
                    pass
                else:
                    self._insert(c, "X")
                if self._check_win("X"):
                    return "X"
                elif self._check_draw():
                    return "_"
            else:
                c = self.o_player(deepcopy(self.field), "O")
                if self.field[0][c] != "_":
                    pass
                else:
                    self._insert(c, "O")
                if self._check_win("O"):
                    return "O"
                elif self._check_draw():
                    return "_"

    def _insert(self,c,player):
        for i in range(6):
            j = 5-i
            if self.field[j][c] == "_":
                self.field[j][c] = player
                return None

    def _check_win(self, player):
        # Zeilen
        for x in range(6):
            for i in range(4):
                if self.field[x][i] == player and self.field[x][i+1] == player and self.field[x][i+2] == player and self.field[x][i+3] == player:
                    return True
        # Spalten
        for y in range(7):
            for i in range(3):
                if self.field[i][y] == player and self.field[i+1][y] == player and self.field[i+2][y] == player and self.field[i+3][y] == player:
                    return True
        # Diagonalen 1
        for x in range(3):
            for y in range(4):
                if self.field[0+x][0+y] == player and self.field[1+x][1+y] == player and self.field[2+x][2+y] == player and self.field[3+x][3+y] == player:
                    return True

        # Diagonalen 2
        for x in range(3):
            for y in range(4):
                if self.field[0+x][3+y] == player and self.field[1+x][2+y] == player and self.field[2+x][1+y] == player and self.field[3+x][0+y] == player:
                    return True

        return False

    def _check_draw(self):
        for x in range(6):
            for y in range(7):
                if self.field[x][y] == "_":
                    return False
        return True

    def _print_field(self):
        for i in self.field:
            print(i)
        print("-----------------------------------")

def random_player(field, player):
    freie_felder = []
    for i in range(7):
        if field[0][i] == "_":
            freie_felder.append(i)
    return rd.choice(freie_felder)

def input_player(field, player):
    while True:
        c = int(input("Wähle deine Spalte (0 bis 6): "))
        if c in [0,1,2,3,4,5,6]:
            if field[0][c] == "_":
                return c
            else:
                print("Die Spalte is schon voll :(")
        else:
            print("Wähle eine Spalte zwischen 0 und 6")

def test_durchlauf(x,o,n):
    x_punkte = 0
    o_punkte = 0
    for i in range(n):
        spiel = FourWins(x, o)
        if spiel._start_wo_print() == "X":
            x_punkte += 1
        else:
            o_punkte += 1
    print(f'X hat {x_punkte} mal gewonnen und O hat {o_punkte} mal gewonnen!')
