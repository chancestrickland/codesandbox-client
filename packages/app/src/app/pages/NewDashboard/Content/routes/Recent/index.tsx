import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import {
  DashboardGridItem,
  DashboardHeader,
  DashboardSandbox,
} from 'app/pages/NewDashboard/types';
import { getPossibleTemplates } from '../../utils';

export const Recent = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, recentSandboxesByTime, getFilteredSandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.RECENT);
  }, [actions.dashboard]);

  const getSection = (
    title: string,
    time: keyof typeof recentSandboxesByTime
  ): [DashboardHeader, ...DashboardSandbox[]] | [] => {
    const recentSandboxes = getFilteredSandboxes(recentSandboxesByTime[time]);

    if (!recentSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...recentSandboxes.map(sandbox => ({
        type: 'sandbox' as 'sandbox',
        sandbox,
      })),
    ];
  };

  const items: DashboardGridItem[] = sandboxes.RECENT
    ? [
        ...getSection('Today', 'day'),
        ...getSection('Last 7 days', 'week'),
        ...getSection('Earlier this month', 'month'),
        ...getSection('Older', 'older'),
      ]
    : [
        { type: 'header', title: 'Today' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Last 7 days' },
        { type: 'skeleton-row' },
      ];

  return (
    <SelectionProvider items={items}>
      <Helmet>
        <title>Recent Sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        templates={getPossibleTemplates(sandboxes.RECENT)}
        title="Recently Modified Sandboxes"
        showViewOptions
        showFilters
      />

      <VariableGrid items={items} />
    </SelectionProvider>
  );
};
