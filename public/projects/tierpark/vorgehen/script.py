import os

_dir = str(input("Gib das directory an \n"))
directory = os.scandir(_dir)
entries = [it.name for it in directory]
print(entries)

with os.scandir(_dir) as directory:
    for item in directory:
        if not item.name.startswith('.') and item.is_file():
            with open(item, mode="w") as file:
                name = (item.name.split(".")[0])
                text = f'<html> \n' \
                    f'  <head>\n' \
                    f'      <title> {name} </title>\n' \
                    f'  </head>\n' \
                    f'  <body>\n' \
                    f'      {name}\n' \
                    f'  </body>\n' \
                    f'</html>\n'
                file.write(text)
print("finished")

