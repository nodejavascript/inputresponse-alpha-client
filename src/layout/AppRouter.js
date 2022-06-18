import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Frame from './Frame'

import Root from '../routes/Root'
import Dashboard from '../routes/Dashboard'
import About from '../routes/About'

import CardProfile from '../routes/CardProfile'
import UpdateProfile from '../routes/UpdateProfile'

import ListNeuralNetworks from '../routes/ListNeuralNetworks'
import CardNeuralNetwork from '../routes/CardNeuralNetwork'
import InsertNeuralNetwork from '../routes/InsertNeuralNetwork'
import UpdateNeuralNetwork from '../routes/UpdateNeuralNetwork'

import ListSamplingClients from '../routes/ListSamplingClients'
import CardSamplingClient from '../routes/CardSamplingClient'
import InsertSamplingClient from '../routes/InsertSamplingClient'
import UpdateSamplingClient from '../routes/UpdateSamplingClient'

import ListModelSamples from '../routes/ListModelSamples'
import CardModelSample from '../routes/CardModelSample'
import InsertModelSample from '../routes/InsertModelSample'
import UpdateModelSample from '../routes/UpdateModelSample'

import ListModelPredictions from '../routes/ListModelPredictions'
import CardModelPrediction from '../routes/CardModelPrediction'
import InsertModelPrediction from '../routes/InsertModelPrediction'
import UpdateModelPrediction from '../routes/UpdateModelPrediction'

// import Canvas from '../routes/Canvas'
// import Charts from '../routes/Charts'

import NoMatch from '../routes/NoMatch'

// booleans come from api later, yuk now
const profilePaths = {
  profile: true,
  updatePath: '/updateprofile',
  cardPath: '/profile',
  listPath: '/profile',
  display: {
    singular: 'Profile'
  }
}

export const neutralNetworkPaths = {
  insertPath: '/insertneuralnetwork',
  listPath: '/neuralnetworks',
  cardPath: '/neuralnetwork',
  updatePath: '/updateneuralnetwork',
  display: {
    singular: 'Neural Network',
    plural: 'Neural Networks',
    info: 'Graph theory, graph analytics with your Neural Networks.'
  }
}

export const samplingClientPaths = {
  insertPath: '/insertsamplingclient',
  listPath: '/samplingclients',
  cardPath: '/samplingclient',
  updatePath: '/updatesamplingclient',
  display: {
    singular: 'Client',
    plural: 'Clients',
    info: 'These may be embedded, apps, users or other AI sources for example. Clients submit payloads ({ input, output }) to any of your Neural Networks.'
  }
}

export const modelSamplePaths = {
  insertPath: '/insertmodelsample',
  listPath: '/modelsamples',
  cardPath: '/modelsample',
  updatePath: '/updatemodelsample',
  display: {
    singular: 'Sample',
    plural: 'Samples',
    info: 'Client payloads used to train your Neural Network\'s Model'
  }
}

export const modelPredictionPaths = {
  insertPath: '/insertmodelprediction',
  listPath: '/modelpredictions',
  cardPath: '/modelprediction',
  updatePath: '/updatemodelprediction',
  display: {
    singular: 'Prediction',
    plural: 'Predictions',
    info: 'Predictions from your Neural Network\'s Model'
  }
}

const otherRoutes = [
  {
    exact: true,
    path: '/updateprofile',
    title: 'Update Profile',
    element: <UpdateProfile paths={profilePaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/neuralnetwork/:neuralnetworkId',
    title: 'Neural Network',
    element: <CardNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    path: '/insertneuralnetwork',
    title: 'Insert Neural Network',
    element: <InsertNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updateneuralnetwork/:neuralnetworkId',
    title: 'Update Neural Network',
    element: <UpdateNeuralNetwork paths={neutralNetworkPaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/samplingclient/:samplingclientId',
    title: 'Client',
    element: <CardSamplingClient paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/insertsamplingclient',
    title: 'Insert Client',
    element: <InsertSamplingClient paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updatesamplingclient/:samplingclientId',
    title: 'Update Client',
    element: <UpdateSamplingClient paths={samplingClientPaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/modelsample/:modelsampleId',
    title: 'Sample',
    element: <CardModelSample paths={modelSamplePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/insertmodelsample',
    title: 'Insert Sample',
    element: <InsertModelSample paths={modelSamplePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updatemodelsample/:modelsampleId',
    title: 'Update Sample',
    element: <UpdateModelSample paths={modelSamplePaths} />,
    auth: true
  },

  {
    exact: true,
    path: '/modelprediction/:modelpredictionId',
    title: 'Prediction',
    element: <CardModelPrediction paths={modelPredictionPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/insertmodelprediction',
    title: 'Insert Prediction',
    element: <InsertModelPrediction paths={modelPredictionPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/updatemodelprediction/:modelpredictionId',
    title: 'Update Prediction',
    element: <UpdateModelPrediction paths={modelPredictionPaths} />,
    auth: true
  }
]

export const navigationalRoutes = [
  {
    exact: true,
    path: '/',
    title: 'Root',
    element: <Root />
  },
  {
    exact: true,
    path: '/dashboard',
    title: 'Dashboard',
    element: <Dashboard />
  },
  {
    exact: true,
    path: '/neuralnetworks',
    title: 'Neural Networks',
    element: <ListNeuralNetworks paths={neutralNetworkPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/samplingclients',
    title: 'Clients',
    element: <ListSamplingClients paths={samplingClientPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/modelsamples',
    title: 'Samples',
    element: <ListModelSamples paths={modelSamplePaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/modelpredictions',
    title: 'Predictions',
    element: <ListModelPredictions paths={modelPredictionPaths} />,
    auth: true
  },
  {
    exact: true,
    path: '/profile',
    title: 'Profile',
    element: <CardProfile paths={profilePaths} />,
    auth: true
  },
  // {
  //   exact: true,
  //   path: '/canvas',
  //   title: 'Canvas',
  //   element: <Canvas />
  // },
  // {
  //   exact: true,
  //   path: '/charts',
  //   title: 'Charts',
  //   element: <Charts />
  // },
  {
    exact: true,
    path: '/about',
    title: 'About',
    element: <About />
  }
]

export const allRoutes = [...otherRoutes, ...navigationalRoutes]

export const returnCurrentRoute = pathname => {
  if (!pathname) return null
  const route = allRoutes.find(i => i.path === pathname)
  if (route) return route

  const path = pathname.split('/')[1]
  return allRoutes.find(i => i.path.includes(path))
}

const AppRouter = ({ reactiveAuthToken }) => {
  return (
    <BrowserRouter>
      <Frame returnCurrentRoute={returnCurrentRoute}>
        <Routes>
          {
            allRoutes.map(route => <Route key={`route${route.path}`} {...route} />)
          }
          <Route path='*' element=<NoMatch /> />
        </Routes>

      </Frame>
    </BrowserRouter>
  )
}

export default AppRouter
