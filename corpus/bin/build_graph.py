#!/usr/bin/env python

import os
import click

from collections import OrderedDict
from textplot.utils import sort_dict
from textplot.text import Text
from textplot.matrix import Matrix
from humanist.graphs import Diachronic


@click.command()
@click.option('--term_depth',   default=3000)
@click.option('--spike_depth',  default=1000)
@click.option('--skim_depth',   default=30)
@click.option('--spike_bw',     default=500000)
def build_graph(term_depth, spike_depth, skim_depth, spike_bw):

    print 'Tokenizing corpus...'
    t = Text.from_file('corpus.txt')
    m = Matrix(t)

    # Get the top X most frequent terms.
    frequent = t.most_frequent_terms(term_depth)

    print 'Computing KDE maxima...'
    spiky = OrderedDict()
    for term in frequent:
        spiky[term] = t.kde_max(term, bandwidth=spike_bw)

    # Sort by KDE max.
    spiky = sort_dict(spiky)

    print 'Indexing terms:'
    m.index(spiky.keys()[:spike_depth])

    g = Diachronic()

    print 'Generating graph:'
    g.build(m, skim_depth)
    g.write_gml('build/graph.gml')


if __name__ == '__main__':
    build_graph()
