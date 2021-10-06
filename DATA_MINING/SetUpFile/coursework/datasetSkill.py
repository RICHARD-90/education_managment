from SetUpFile.coursework.subject import Subject


def creating_data():
    count = 26
    data = []
    count += 1
    data.append(Subject(count, "LANG501a", [], [18, 21]))

    count += 1
    data.append(Subject(count, "SHES501a", [], [11, 12, 15, 16, 18]))
    count += 1
    data.append(Subject(count, "SHES505", [], [11, 12, 14, 16, 23, 25, 18, 19, 21]))
    count += 1
    data.append(Subject(count, "DDRS501", [], [8, 11, 19, 20, 21, 22]))
    count += 1
    data.append(Subject(count, "INFO501a", [], [1, 2, 13]))
    count += 1
    data.append(Subject(count, "INFO502a", [], [1, 5, 6]))
    data.append(Subject(count, "MATH500a", [], [6, 13]))
    count += 1
    data.append(Subject(count, "MATH501a", [], [6, 13]))
    count += 1
    data.append(Subject(count, "EASI541b", [], [1, 9]))
    count += 1
    data.append(Subject(count, "ISOC531", [], [7, 14, 15, 17]))
    count += 1
    data.append(Subject(count, "MATH531", [], [1, 2]))
    count += 1
    data.append(Subject(count, "PROJ531", [], [1, 14, 20, 11, 16, 17, 6, 9]))

    # Semestre 9
    count += 1
    data.append(Subject(count, "LANG901a", [], [16, 18, 21]))
    count += 1
    data.append(Subject(count, "LANG902a", [], [16, 18, 21]))
    count += 1
    data.append(Subject(count, "PROJ901a", [], [13, 16, 18, 23, 24, 25, 11, 12, 15]))
    count += 1
    data.append(Subject(count, "SHES901a", [], [17, 18, 22, 11, 15]))
    count += 1
    data.append(Subject(count, "INFO931", [], [5, 9, 12, 14, 7, 8]))
    count += 1
    data.append(Subject(count, "INFO932", [], [1, 2, 3, 9]))
    count += 1
    data.append(Subject(count, "PROJ931", [], [1, 6, 7]))
    count += 1
    data.append(Subject(count, "DATA931", [], [3, 4, 6, 7, 9, 18]))
    count += 1
    data.append(Subject(count, "ISOC931", [], [12, 16, 21, 23]))
    count += 1
    data.append(Subject(count, "PROJ932", [], [1, 2, 3, 4, 9]))

    # Semestre 10
    count += 1
    data.append(Subject(count, "PROJ001", [],
                        [19, 20, 21, 22, 11, 12, 13, 14, 15, 16, 17, 18, 25,
                         26]))

    # semestre 6

    # net.add_edge(count, "LANG601", [], [16, 18, 21]))
    count += 1
    data.append(Subject(count, "PROJ601a", [], [16, 17, 18, 21]))
    count += 1
    data.append(Subject(count, "SHES601a", [], [20]))
    count += 1
    data.append(Subject(count, "SHES602a", [], [20]))
    count += 1
    data.append(Subject(count, "INFO631a", [], [1, 2]))
    count += 1
    data.append(Subject(count, "MATH641c", [], [4, 6]))
    count += 1
    data.append(Subject(count, "PROJ631a", [], [4, 4, 9, 23, 24]))
    count += 1
    data.append(Subject(count, "INFO632", [], [1, 9]))
    count += 1
    data.append(Subject(count, "INFO641c", [], [1, 9]))
    count += 1
    data.append(Subject(count, "INFO642c", [], [1, 9, 6, 5]))
    count += 1
    data.append(Subject(count, "ISOC631", [], [6, 4, 9, 14]))
    count += 1
    data.append(Subject(count, "PROJ632", [], [1, 4]))
    count += 1
    data.append(Subject(count, "INFO632a", [], [1, 9]))
    count += 1
    data.append(Subject(count, "ISOC631a", [], [4, 6, 11]))
    count += 1
    data.append(Subject(count, "PROJ632a", [], [1, 4]))

    # semestre 8
    count += 1
    data.append(Subject(count, "LANG801a", [], [16, 18, 21]))
    count += 1
    data.append(Subject(count, "LANG802a", [], [16, 18, 21]))
    count += 1
    data.append(Subject(count, "SHES802a", [], [11, 18, 19, 20]))
    count += 1
    data.append(Subject(count, "SHES803a", [], [20]))
    count += 1
    data.append(Subject(count, "PROJ801", [],
                        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                         24, 25, 26]))
    count += 1
    data.append(Subject(count, "DATA831a", [], [1, 3]))
    count += 1
    data.append(Subject(count, "DATA832a", [], [3, 4, 5, 6, 12, 20]))
    count += 1
    data.append(Subject(count, "INFO831a", [], [3, 4, 5, 7, 20]))
    count += 1
    data.append(Subject(count, "PROJ831a", [], [1, 4]))
    count += 1
    data.append(Subject(count, "INFO832a", [], [1, 7]))
    count += 1
    data.append(Subject(count, "INFO833a", [], [1, 2, 3, 9, 10]))
    count += 1
    data.append(Subject(count, "INFO834a", [], [20, 12, 9, 6, 3, 2]))
    count += 1
    data.append(Subject(count, "ISOC831a", [], [19, 20]))
    return data
