

import networkx as nx

from textplot.graphs import Graph
from clint.textui import progress


class Diachronic(Graph):


    def build(self, matrix, skim_depth=10, **kwargs):

        """
        Register term count, KDE max, and center-of-mass on nodes.

        :param matrix: A term matrix.
        :param skim_depth: The number of sibling edges.
        """

        for anchor in progress.bar(matrix.terms):

            n1 = matrix.text.unstem(anchor)

            # Heaviest pair scores:
            pairs = matrix.anchored_pairs(anchor).items()
            for term, weight in pairs[:skim_depth]:

                n2 = matrix.text.unstem(term)
                self.graph.add_edge(n1, n2, weight=weight)
