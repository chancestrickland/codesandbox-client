import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';
import { getPossibleTemplates } from '../../utils';

export const Deleted = () => {
  const {
    actions,
    state: {
      dashboard: { deletedSandboxesByTime, getFilteredSandboxes, sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DELETED);
  }, [actions.dashboard]);

  const getSection = (
    title: string,
    deletedSandboxes: SandboxFragmentDashboardFragment[]
  ): DashboardGridItem[] => {
    if (!deletedSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...deletedSandboxes.map(sandbox => ({
        type: 'sandbox' as 'sandbox',
        sandbox,
      })),
    ];
  };

  const items: DashboardGridItem[] = sandboxes.DELETED
    ? [
        ...getSection(
          'Archived this week',
          getFilteredSandboxes(deletedSandboxesByTime.week)
        ),
        ...getSection(
          'Archived earlier',
          getFilteredSandboxes(deletedSandboxesByTime.older)
        ),
      ]
    : [
        { type: 'header', title: 'Archived this week' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Archived earlier' },
        { type: 'skeleton-row' },
      ];

  return (
    <SelectionProvider items={items}>
      <Helmet>
        <title>Deleted Sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently Deleted"
        showFilters
        showSortOptions
        templates={getPossibleTemplates(sandboxes.DELETED)}
      />
      <VariableGrid items={items} />
    </SelectionProvider>
  );
};
