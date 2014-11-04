

from textplot.graphs import Graph
from clint.textui import progress


class Diachronic(Graph):


    def build(self, matrix, skim_depth=10):

        """
        Register term count, KDE max, and center-of-mass on nodes.

        :param matrix: A term matrix.
        :param skim_depth: The number of sibling edges.
        """

        # Nodes:
        for term in matrix.terms:

            # Unstem the label.
            label = matrix.text.unstem(term);

            # Register the metadata.
            self.graph.add_node(label, {
                'count':    len(matrix.text.terms[term]),
                'kde_max':  matrix.text.kde_max(term),
                'median':   matrix.text.median_ratio(term)
            })

        # Edges:
        for anchor in progress.bar(matrix.terms):

            n1 = matrix.text.unstem(anchor)

            # Heaviest pair scores:
            pairs = matrix.anchored_pairs(anchor).items()
            for term, weight in pairs[:skim_depth]:

                n2 = matrix.text.unstem(term)
                self.graph.add_edge(n1, n2, weight=weight)
