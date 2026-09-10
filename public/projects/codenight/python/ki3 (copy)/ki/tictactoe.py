import random as rd
from copy import deepcopy

class TicTacToe:
    def __init__(self, x, o):
        self.x_player = x
        self.o_player = o
        self.field = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]]

    def start(self):
        n = 0
        self._print_field()
        while True:
            n += 1
            print(f'Spielzug {n}')
            if n % 2 == 1:
                x, y = self.x_player(deepcopy(self.field), "X")
                if self.field[x][y] != "_":
                    print("Das Feld ist bereits belegt!")
                else:
                    self.field[x][y] = "X"
                    self._print_field()
                if self._check_win("X"):
                    print("X hat gewonnen")
                    return "X"
                elif self._check_draw():
                    print("Unentschieden")
                    return "_"
            else:
                x, y = self.o_player(deepcopy(self.field), "O")
                if self.field[x][y] != "_":
                    print("Das Feld ist bereits belegt!")
                else:
                    self.field[x][y] = "O"
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
                x, y = self.x_player(deepcopy(self.field), "X")
                if self.field[x][y] != "_":
                    pass
                else:
                    self.field[x][y] = "X"
                if self._check_win("X"):
                    return "X"
                elif self._check_draw():
                    return "_"
            else:
                x, y = self.o_player(deepcopy(self.field), "O")
                if self.field[x][y] != "_":
                    pass
                else:
                    self.field[x][y] = "O"
                if self._check_win("O"):
                    return "O"
                elif self._check_draw():
                    return "_"

    def _check_win(self, player):
        # Reihen
        for j in [0, 1, 2]:
            if self.field[j] == [player, player, player]:
                return True
        # Spalten
        for j in [0, 1, 2]:
            if self.field[0][j] == player and self.field[1][j] == player and self.field[2][j] == player:
                return True

        # Diagonale 1
        if self.field[0][0] == player and self.field[1][1] == player and self.field[2][2] == player:
            return True

        # Diagonale 2
        if self.field[2][0] == player and self.field[1][1] == player and self.field[0][2] == player:
            return True

        return False

    def _check_draw(self):
        for x in [0, 1, 2]:
            for y in [0, 1, 2]:
                if self.field[x][y] == "_":
                    return False
        return True

    def _print_field(self):
        for i in self.field:
            print(f'{i}')
        print("-------------------")


def random_player(field, player):
    freie_felder = []
    for x in [0, 1, 2]:
        for y in [0, 1, 2]:
            if field[x][y] == "_":
                freie_felder.append([x, y])
    move = rd.choice(freie_felder)
    return move[0], move[1]


def input_player(field, player):
    while True:
        i = input("Zeile, Spalte: ")
        i = i.split(",")
        x = int(i[0])
        y = int(i[1])

        if field[x][y] == "_":
            return x, y
        else:
            print("Feld ist nicht frei!")


def test_durchlauf(x, o, n):
    x_punkte = 0
    o_punkte = 0
    for i in range(n):
        spiel = TicTacToe(x, o)
        if spiel._start_wo_print() == "X":
            x_punkte += 1
        else:
            o_punkte += 1
    print(f'X hat {x_punkte} mal gewonnen und O hat {o_punkte} mal gewonnen!')
